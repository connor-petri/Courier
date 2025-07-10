import json

if __name__ == "__main__":
    with open("monster-data.json") as f:
        monster_data = json.load(f)["monsters"]

    with open("keywords.json") as f:
        keywords_dict = json.load(f)

    for monster in monster_data:
        if monster[0].lower() not in keywords_dict["keywords"]:
            keywords_dict["keywords"].append(monster[0].lower())

    with open("keywords.json", "w") as f:
        json.dump(keywords_dict, f)
