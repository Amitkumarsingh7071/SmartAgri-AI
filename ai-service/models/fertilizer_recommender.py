def recommend_fertilizer(crop_name, N, P, K, pH, moisture):
    crop_lower = crop_name.lower()
    
    # Defaults
    fertilizer = "NPK 19-19-19 (Balanced Fertilizer)"
    quantity = "15 kg/Acre"
    method = "Foliar spray or Fertigation"
    reasoning = "Your soil nutrients are relatively balanced. A maintenance dose of balanced NPK 19-19-19 is recommended to maintain crop health."
    
    # 1. WHEAT
    if "wheat" in crop_lower:
        if N < 80:
            fertilizer = "Urea (46% Nitrogen)"
            quantity = "50 kg/Acre"
            method = "Top dressing in two split doses (at first irrigation and tillering stage)"
            reasoning = f"Wheat crop requires high nitrogen. Your soil N ({N} ppm) is low. Urea will promote healthy green leaves and stem elongation."
        elif P < 40:
            fertilizer = "Di-Ammonium Phosphate (DAP 18-46-0)"
            quantity = "45 kg/Acre"
            method = "Basal application (apply deep in soil at sower depth during planting)"
            reasoning = f"Your soil Phosphorus ({P} ppm) is below the optimal 40 ppm for wheat. DAP is ideal for early root branching and spikelet formation."
        elif K < 140:
            fertilizer = "Muriate of Potash (MOP - 60% K2O)"
            quantity = "25 kg/Acre"
            method = "Basal application, mixed with soil before sowing"
            reasoning = f"Soil Potassium ({K} ppm) is deficient. Potassium is required for starch accumulation, grain filling, and winter frost tolerance."
        elif pH < 6.0:
            fertilizer = "Agricultural Lime (Calcium Carbonate)"
            quantity = "200 kg/Acre"
            method = "Broadcast and disk-mix into soil 3-4 weeks before sowing"
            reasoning = f"Soil pH ({pH}) is too acidic for wheat. Lime raises pH, reducing aluminum toxicity and unlocking locked nutrients."

    # 2. RICE / PADDY
    elif "rice" in crop_lower or "paddy" in crop_lower:
        if N < 75:
            fertilizer = "Urea (46% N) + Neem Coated Urea"
            quantity = "65 kg/Acre"
            method = "Broadcasting in 3 splits: 50% at transplanting, 25% at active tillering, and 25% at panicle initiation"
            reasoning = f"Rice is highly sensitive to nitrogen. Neem-coated urea reduces leaching in flooded paddies, ensuring slow and steady absorption."
        elif P < 35:
            fertilizer = "Single Super Phosphate (SSP)"
            quantity = "60 kg/Acre"
            method = "Incorporated into mud during final puddling/land prep"
            reasoning = f"Phosphorus ({P} ppm) is low. SSP also contains Sulfur (12%) which is highly beneficial for rice tillers and early establishment."
        elif K < 120:
            fertilizer = "Muriate of Potash (MOP)"
            quantity = "30 kg/Acre"
            method = "Broadcasting in two splits: 50% basal and 50% at panicle initiation"
            reasoning = f"Soil Potassium ({K} ppm) is low. Potash is crucial for paddy crop disease resistance, grain weight, and prevention of lodging (falling)."

    # 3. COTTON
    elif "cotton" in crop_lower:
        if N < 90:
            fertilizer = "Urea or Ammonium Sulfate"
            quantity = "75 kg/Acre"
            method = "Side-dressing at the side of rows at squaring (45 days) and peak flowering (75 days) stages"
            reasoning = f"Cotton demands major nitrogen splits to support lint production. Ammonium sulfate adds sulfur, improving boll quality."
        elif P < 45:
            fertilizer = "DAP (Di-Ammonium Phosphate)"
            quantity = "50 kg/Acre"
            method = "Band placement 5 cm below and to the side of the seed line"
            reasoning = f"Your Phosphorus level ({P} ppm) is low. Basal DAP ensures root proliferation and early flower boll set."
        elif K < 140:
            fertilizer = "Sulfate of Potash (SOP - Potassium Sulfate)"
            quantity = "40 kg/Acre"
            method = "Soil application before sowing"
            reasoning = f"Potassium ({K} ppm) is deficient. SOP is preferred over MOP for high-quality long-staple cotton fiber strength and thickness."

    # 4. MAIZE / CORN
    elif "maize" in crop_lower or "corn" in crop_lower:
        if N < 80:
            fertilizer = "Urea"
            quantity = "55 kg/Acre"
            method = "Band placement at knee-high stage and tasseling stage"
            reasoning = f"Maize is a heavy nitrogen consumer. Sidedressing urea during rapid growth (knee-high) ensures high grain yield."
        elif P < 40:
            fertilizer = "DAP"
            quantity = "40 kg/Acre"
            method = "Placement in bands during sowing"
            reasoning = f"Phosphorus is low ({P} ppm). DAP boosts early plant vigor and cob development."

    # 5. LEGUMES / BEANS / PULSES
    elif "legume" in crop_lower or "pulse" in crop_lower or "bean" in crop_lower or "pea" in crop_lower:
        if P < 35:
            fertilizer = "SSP (Single Super Phosphate)"
            quantity = "45 kg/Acre"
            method = "Basal application at sowing"
            reasoning = f"Legumes need high phosphorus ({P} ppm) for nodule formation. SSP also provides calcium and sulfur."
        elif N < 20:
            fertilizer = "Starter NPK 12-32-16"
            quantity = "20 kg/Acre"
            method = "Basal dressing at sowing"
            reasoning = "Legumes fix their own nitrogen, but a small starter dose of NPK helps the seedling grow before nodules develop."

    return {
        "crop_name": crop_name,
        "recommended_fertilizer": fertilizer,
        "quantity_kg_acre": quantity,
        "application_method": method,
        "reasoning": reasoning
    }
