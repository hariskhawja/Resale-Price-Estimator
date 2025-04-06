# Custom multi-variable depreciation function based on the following sources:
# https://www.kaggle.com/c/mercari-price-suggestion-challenge/data
# https://zenodo.org/records/8386668
# https://americasthriftsupply.com/blogs/news/how-to-price-clothing-for-resale-a-beginners-guide
# https://www.wallstreetprep.com/knowledge/resale-value/

# Assume a Declining Balance Model

# Brand Factors
brands_premium = {
    "Prada", "Burberry", "Fendi", "Balenciaga", "Saint Laurent", "Bottega Veneta", "Loewe", "Celine", 
    "Miu Miu", "Chloé", "Givenchy", "Valentino", "Marc Jacobs", "Ralph Lauren Purple Label", "Alexander McQueen"
}  # 1.1

brands_lux = {
    "Gucci", "Hermes", "Chanel", "Louis Vuitton", "Dior", "Rolex", "Cartier", "Tiffany & Co.", 
    "Bulgari", "Montblanc", "Vacheron Constantin", "Patek Philippe", "Tom Ford", "Loro Piana", "Bally", 
    "Brunello Cucinelli", "Zegna", "Maserati", "Ferrari"
}  # 0.98

brands_upper_mid = {
    "Tommy Hilfiger", "Ralph Lauren", "Lacoste", "Calvin Klein", "J.Crew", "Ted Baker", "Michael Kors", 
    "Coach", "Kate Spade", "Hugo Boss", "Paul Smith", "Brooks Brothers", "Burberry Brit", "AllSaints", 
    "True Religion", "Rag & Bone", "Banana Republic", "Diesel", "Armani Exchange", "Gant", "Barbour"
}  # 0.95

brands_mid = {
    "Calvin Klein", "Adidas", "Levi's", "Nike", "Tommy Jeans", "Dockers", "Puma", "Converse", 
    "Gap", "Wrangler", "Lee", "Reebok", "Under Armour", "Superdry", "Vans", "New Balance", "Columbia", 
    "American Eagle", "Express", "Hollister", "Uniqlo", "H&M", "A&F", "Old Navy", "Skechers", "Jack & Jones", 
    "Fila", "Abercrombie & Fitch", "Toms", "T-shirt Company", "BOSS Orange"
}  # 0.93

brands_low = {
    "Zara", "H&M", "Uniqlo", "Forever 21", "Boohoo", "Shein", "Primark", "Matalan", "ASOS", "Charlotte Russe", 
    "Romwe", "Nasty Gal", "Tillys", "Bershka", "Pull & Bear", "C&A", "PrettyLittleThing", "Missguided", 
    "PacSun", "Target", "Kohl's", "Walmart", "Old Navy", "Kmart", "Cotton On", "Lidl", "Aldi", "Peacocks", 
    "Sainsbury's", "Marks & Spencer", "Stradivarius", "New Look", "River Island", "Juniors", "Mango", 
    "GAP", "American Apparel"
}  # 0.90

brands_fast_fashion = {
    "Forever 21", "Boohoo", "Shein", "Romwe", "Nasty Gal", "PrettyLittleThing", "Zaful", "Wish", 
    "AliExpress", "Shien", "ASOS", "Pipeless", "Kohls", "American Eagle", "Aeropostale", "Target", 
    "Walmart", "Shopbop", "Nasty Gal", "Rainbow", "Hollister", "Express", "Macy's", "J.C. Penney", 
    "Sears", "Burlington", "TJ Maxx", "Ross Dress for Less", "Forever 21", "Urban Outfitters"
}  # 0.88

# Category Factors
categories_high_value = {
    "Dress", "Polo"
} # 0.98

categories_mid_value = {
    "Jeans", "Hoodie", "Sweatshirt", "Jacket"
} # 0.97

categories_low_value = {
    "T-Shirt", "Long-Sleeves", "Sweatpants", "Shorts", 
} # 0.96

# Condition Factors
# Excellent -> 1
# Good -> 0.98
# Decent -> 0.97
# Poor   -> 0.8

# Material Factors
material_xl = {
    "Polyester", "Acrylic", "Spandex", "Leather", "Fleece", "Silk", "Suede"
} # 0.98

material_l = {
    "Nylon", "Velvet"
} # 0.97

material_m = {
    "Wool", "Cashmere"
} # 0.96

material_s = {
    "Denim"
} # 0.95

material_xs = {
    "Other"
} # 0.94

material_xxs = {
    "Linen", "Cotton", "Rayon"
} # 0.93

# Rarity Factors
# General Release -> 1
# Others -> 1.1

def brandConverter(brand):
    if brand in brands_premium: return 1.10
    elif brand in brands_lux: return 0.98
    elif brand in brands_upper_mid: return 0.95
    elif brand in brands_mid: return 0.93
    elif brand in brands_low: return 0.90
    elif brand in brands_fast_fashion: return 0.88
    else: return 0.90

def categoryConverter(category):
    if category in categories_high_value: return 0.98
    elif category in categories_mid_value: return 0.97
    elif category in categories_low_value: return 0.96
    else: return 0.97

def conditionConverter(condition):
    if condition == "Excellent": return 1
    elif condition == "Good": return 0.98
    elif condition == "Decent": return 0.97
    else: return 0.8

def materialConverter(material):
    if material in material_xl: return 0.98
    elif material in material_l: return 0.97
    elif material in material_m: return 0.96
    elif material in material_s: return 0.95
    elif material in material_xs: return 0.94
    else: return 0.93

def rarityConverter(rarity):
    if rarity == "General Release": return 1
    else: return 1.1

def depreciator(price, brand, category, condition, material, rarity, age):
    return price*((brandConverter(brand)*categoryConverter(category)*conditionConverter(condition)*materialConverter(material)*rarityConverter(rarity))**(age/12))