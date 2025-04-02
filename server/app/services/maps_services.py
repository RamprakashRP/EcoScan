# server/app/services/maps_services.py
import requests
import os
import math

def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the great-circle distance between two points on Earth (in km).
    """
    R = 6371  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def find_nearby_recyclers(lat, lng):
    """
    Find the nearest 5 e-waste recyclers using the Google Places API.
    Returns a list of dictionaries containing name, address, rating,
    distance from the user, a thumbnail image, and a URL to open Google Maps.
    """
    lat = float(lat)
    lng = float(lng)
    api_key = os.environ.get("PLACES_API_KEY")
    if not api_key:
        raise Exception("Missing PLACES_API_KEY in environment.")

    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "location": f"{lat},{lng}",
        "radius": 5000,             # 5 km radius
        "keyword": "ewaste recycler",  # or "electronic recycling"
        "key": api_key,
    }

    response = requests.get(url, params=params)
    data = response.json()

    if "error_message" in data:
        raise Exception(f"Places API error: {data['error_message']}")

    results = data.get("results", [])
    # Limit to the first 5 results
    top_results = results[:5]
    recyclers = []
    for result in top_results:
        name = result.get("name")
        address = result.get("vicinity")
        rating = result.get("rating", "N/A")
        place_id = result.get("place_id")

        # Calculate distance using the provided location in the result
        result_location = result.get("geometry", {}).get("location", {})
        result_lat = result_location.get("lat")
        result_lng = result_location.get("lng")
        distance = ""
        if result_lat and result_lng:
            dist_km = haversine_distance(lat, lng, result_lat, result_lng)
            distance = f"{dist_km:.1f} km"

        # Get thumbnail image from the first photo, if available
        thumbnail = ""
        photos = result.get("photos")
        if photos and len(photos) > 0:
            photo_reference = photos[0].get("photo_reference")
            thumbnail = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference={photo_reference}&key={api_key}"

        # Build a Google Maps URL using the place_id
        maps_url = ""
        if place_id:
            maps_url = f"https://www.google.com/maps/search/?api=1&query={name.replace(' ', '+')}&query_place_id={place_id}"

        recyclers.append({
            "name": name,
            "address": address,
            "rating": rating,
            "distance": distance,
            "thumbnail": thumbnail,
            "maps_url": maps_url,
        })

    return recyclers
