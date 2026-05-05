SELECT 
    id,
    user_id,
    full_name,
    address_line1,
    address_line2,
    city,
    state,
    zip_code,
    country,
    phone
FROM shipping_info
WHERE user_id = ?;