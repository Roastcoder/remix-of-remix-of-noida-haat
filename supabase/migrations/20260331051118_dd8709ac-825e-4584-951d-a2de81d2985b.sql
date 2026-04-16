
-- Update categories to use slug format and add rich specs

UPDATE crm_products SET category = 'dell-laptop', specs = '{"list":["Intel Core i5-1235U","8GB DDR4","512GB NVMe SSD","15.6\" FHD IPS"],"ram":"8GB","storage":"512GB SSD","rating":4.4,"reviews":456,"badge":"Popular","originalPrice":48999}'::jsonb WHERE id = '1e590950-96fd-4241-88b7-69683c936c03';

UPDATE crm_products SET category = 'hp-laptop', specs = '{"list":["Intel Core i7-1355U","16GB DDR5","512GB NVMe SSD","14\" FHD+ Touch"],"ram":"16GB","storage":"512GB SSD","rating":4.6,"reviews":312,"badge":"Best Seller"}'::jsonb WHERE id = 'bf43f76a-f04a-4201-9617-71965f499e20';

UPDATE crm_products SET category = 'lenovo-laptop', specs = '{"list":["AMD Ryzen 5 7520U","8GB DDR5","512GB NVMe SSD","15.6\" FHD"],"ram":"8GB","storage":"512GB SSD","rating":4.3,"reviews":278,"originalPrice":39999}'::jsonb WHERE id = '9e0f8062-6668-4857-896d-b3481565d1e7';

UPDATE crm_products SET category = 'macbook', specs = '{"list":["Apple M2 Chip","8GB Unified Memory","256GB SSD","13.6\" Liquid Retina"],"ram":"8GB","storage":"256GB SSD","rating":4.8,"reviews":892,"badge":"Premium","originalPrice":114999}'::jsonb WHERE id = '4717a5cc-dbdf-430b-974a-763deacf9a67';

UPDATE crm_products SET category = 'cpu-desktop', specs = '{"list":["Intel Core i5-13400","8GB DDR4","512GB NVMe SSD","Intel UHD 730"],"ram":"8GB","storage":"512GB SSD","rating":4.5,"reviews":189,"badge":"New"}'::jsonb WHERE id = 'd7df0eab-49b6-4632-8613-d083dac06929';

UPDATE crm_products SET category = 'cpu-desktop', specs = '{"list":["Intel Core i5-13500","16GB DDR4","512GB NVMe SSD","Intel UHD 770"],"ram":"16GB","storage":"512GB SSD","rating":4.4,"reviews":134}'::jsonb WHERE id = '57e92900-e59a-4815-8c49-a7509157db9a';

UPDATE crm_products SET category = 'printers', specs = '{"list":["Laser Print/Scan/Copy","40 ppm","Auto Duplex","Wi-Fi & Ethernet"],"rating":4.5,"reviews":567,"badge":"Office Pick"}'::jsonb WHERE id = 'cd709ed6-cafc-44d2-a436-1fe979352ef6';

UPDATE crm_products SET category = 'printers', specs = '{"list":["Ink Tank Print/Scan/Copy","10.8 ipm","Borderless Photo","Wi-Fi Direct"],"rating":4.3,"reviews":891,"badge":"Value Pick","originalPrice":15995}'::jsonb WHERE id = '1c9de657-cdb0-4777-8f44-beb7421a7573';

UPDATE crm_products SET category = 'keyboards', specs = '{"list":["Membrane Keys","RGB Backlit","Anti-ghosting","USB Wired"],"rating":4.2,"reviews":445}'::jsonb WHERE id = 'e61e44ee-dc27-4e40-b9b0-e6fa0dcaf174';

UPDATE crm_products SET category = 'keyboards', specs = '{"list":["Wireless Combo","Mouse + Keyboard","2.4GHz","Long Battery Life"],"rating":4.4,"reviews":1203,"badge":"Best Seller"}'::jsonb WHERE id = 'c45fc887-99c1-4737-bd87-936d1b6e22c6';

UPDATE crm_products SET category = 'keyboards', specs = '{"list":["24\" FHD IPS","75Hz","HDMI + VGA","Borderless Design"],"rating":4.6,"reviews":678,"originalPrice":12499}'::jsonb WHERE id = '4921af08-a1c0-4c0f-995c-c361e518e0a0';

UPDATE crm_products SET category = 'keyboards', specs = '{"list":["Dual Band AC1200","MU-MIMO","4 Antennas","Gigabit Ports"],"rating":4.3,"reviews":2045}'::jsonb WHERE id = '4a844661-3982-41fb-b77f-e41454b5ccfd';

UPDATE crm_products SET category = 'keyboards', specs = '{"list":["1TB Portable HDD","USB 3.0","Password Protection","Auto Backup"],"rating":4.5,"reviews":3201,"badge":"Popular"}'::jsonb WHERE id = '021a718d-76dd-40f1-8056-d35da6bf9c68';

UPDATE crm_products SET category = 'keyboards', specs = '{"list":["600VA/360W","3+1 Outlets","USB Charging","Surge Protection"],"rating":4.1,"reviews":567}'::jsonb WHERE id = 'c2ba54f5-3d76-42a6-8be4-e2be98bb5876';

UPDATE crm_products SET category = 'keyboards', specs = '{"list":["4 Channel DVR","2MP Cameras x4","Night Vision","Mobile View"],"rating":4.7,"reviews":234,"badge":"Security Pick","originalPrice":14999}'::jsonb WHERE id = 'dc8f7b21-262a-4437-ac6e-512f3b5b4f26';
