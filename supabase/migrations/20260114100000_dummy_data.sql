-- Migration: Comprehensive Dummy Data for Development
-- This migration inserts realistic sample data for testing and development purposes
-- Run this migration only in development environments

-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- CLEAR EXISTING DATA (optional - uncomment if you want to reset)
-- ============================================================================
-- DELETE FROM order_items;
-- DELETE FROM orders;
-- DELETE FROM subscriptions;
-- DELETE FROM plans;
-- DELETE FROM services;
-- DELETE FROM user_profiles;

-- ============================================================================
-- AUTH USERS (Create users in auth system first)
-- ============================================================================

-- Note: In production, users are created through the Supabase Auth system
-- For development, we create them directly in auth.users
-- Password hash is bcrypt for 'password123' and 'admin123'
-- Hash for 'password123': $2a$10$mHKv6LYLqQKJ4h6FxZ9MtOsIvYjJ4k7k4FcW0vKr5eoqKJu3T4M0W
-- Hash for 'admin123': $2a$10$1K8L2z.h7H8Z0k9U4Fd9YuNPZY9U6Z1X2Y3Z4A5B6C7D8E9F0G1H2

INSERT INTO auth.users (
  id, 
  instance_id, 
  email, 
  encrypted_password, 
  email_confirmed_at, 
  created_at, 
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role
) VALUES
('550e8400-e29b-41d4-a716-446655440000', '00000000-0000-0000-0000-000000000000', 'john@example.com', '$2a$10$mHKv6LYLqQKJ4h6FxZ9MtOsIvYjJ4k7k4FcW0vKr5eoqKJu3T4M0W', NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days', NOW(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
('550e8400-e29b-41d4-a716-446655440001', '00000000-0000-0000-0000-000000000000', 'jane@example.com', '$2a$10$mHKv6LYLqQKJ4h6FxZ9MtOsIvYjJ4k7k4FcW0vKr5eoqKJu3T4M0W', NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days', NOW(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
('550e8400-e29b-41d4-a716-446655440002', '00000000-0000-0000-0000-000000000000', 'bob@example.com', '$2a$10$mHKv6LYLqQKJ4h6FxZ9MtOsIvYjJ4k7k4FcW0vKr5eoqKJu3T4M0W', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days', NOW(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
('550e8400-e29b-41d4-a716-446655440003', '00000000-0000-0000-0000-000000000000', 'alice@example.com', '$2a$10$mHKv6LYLqQKJ4h6FxZ9MtOsIvYjJ4k7k4FcW0vKr5eoqKJu3T4M0W', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days', NOW(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
('550e8400-e29b-41d4-a716-446655440004', '00000000-0000-0000-0000-000000000000', 'charlie@example.com', '$2a$10$mHKv6LYLqQKJ4h6FxZ9MtOsIvYjJ4k7k4FcW0vKr5eoqKJu3T4M0W', NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days', NOW(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
('550e8400-e29b-41d4-a716-446655440005', '00000000-0000-0000-0000-000000000000', 'diana@example.com', '$2a$10$mHKv6LYLqQKJ4h6FxZ9MtOsIvYjJ4k7k4FcW0vKr5eoqKJu3T4M0W', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days', NOW(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
('550e8400-e29b-41d4-a716-446655440006', '00000000-0000-0000-0000-000000000000', 'admin@mszecomstore.com', '$2a$10$1K8L2z.h7H8Z0k9U4Fd9YuNPZY9U6Z1X2Y3Z4A5B6C7D8E9F0G1H2', NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days', NOW(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
('550e8400-e29b-41d4-a716-446655440007', '00000000-0000-0000-0000-000000000000', 'eva@example.com', '$2a$10$mHKv6LYLqQKJ4h6FxZ9MtOsIvYjJ4k7k4FcW0vKr5eoqKJu3T4M0W', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days', NOW(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
('550e8400-e29b-41d4-a716-446655440008', '00000000-0000-0000-0000-000000000000', 'frank@example.com', '$2a$10$mHKv6LYLqQKJ4h6FxZ9MtOsIvYjJ4k7k4FcW0vKr5eoqKJu3T4M0W', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', NOW(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
('550e8400-e29b-41d4-a716-446655440009', '00000000-0000-0000-0000-000000000000', 'grace@example.com', '$2a$10$mHKv6LYLqQKJ4h6FxZ9MtOsIvYjJ4k7k4FcW0vKr5eoqKJu3T4M0W', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NOW(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
('550e8400-e29b-41d4-a716-446655440010', '00000000-0000-0000-0000-000000000000', 'henry@example.com', '$2a$10$mHKv6LYLqQKJ4h6FxZ9MtOsIvYjJ4k7k4FcW0vKr5eoqKJu3T4M0W', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
('550e8400-e29b-41d4-a716-446655440011', '00000000-0000-0000-0000-000000000000', 'iris@example.com', '$2a$10$mHKv6LYLqQKJ4h6FxZ9MtOsIvYjJ4k7k4FcW0vKr5eoqKJu3T4M0W', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
('550e8400-e29b-41d4-a716-446655440012', '00000000-0000-0000-0000-000000000000', 'jack@example.com', '$2a$10$mHKv6LYLqQKJ4h6FxZ9MtOsIvYjJ4k7k4FcW0vKr5eoqKJu3T4M0W', NOW() - INTERVAL '18 hours', NOW() - INTERVAL '18 hours', NOW(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
('550e8400-e29b-41d4-a716-446655440013', '00000000-0000-0000-0000-000000000000', 'kate@example.com', '$2a$10$mHKv6LYLqQKJ4h6FxZ9MtOsIvYjJ4k7k4FcW0vKr5eoqKJu3T4M0W', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '12 hours', NOW(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
('550e8400-e29b-41d4-a716-446655440014', '00000000-0000-0000-0000-000000000000', 'liam@example.com', '$2a$10$mHKv6LYLqQKJ4h6FxZ9MtOsIvYjJ4k7k4FcW0vKr5eoqKJu3T4M0W', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours', NOW(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

-- Create corresponding identities in auth.identities
INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', '{"sub":"550e8400-e29b-41d4-a716-446655440000","email":"john@example.com"}', 'email', NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days', NOW()),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '{"sub":"550e8400-e29b-41d4-a716-446655440001","email":"jane@example.com"}', 'email', NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days', NOW()),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '{"sub":"550e8400-e29b-41d4-a716-446655440002","email":"bob@example.com"}', 'email', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days', NOW()),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '{"sub":"550e8400-e29b-41d4-a716-446655440003","email":"alice@example.com"}', 'email', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days', NOW()),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', '{"sub":"550e8400-e29b-41d4-a716-446655440004","email":"charlie@example.com"}', 'email', NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days', NOW()),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', '{"sub":"550e8400-e29b-41d4-a716-446655440005","email":"diana@example.com"}', 'email', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days', NOW()),
('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440006', '{"sub":"550e8400-e29b-41d4-a716-446655440006","email":"admin@mszecomstore.com"}', 'email', NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days', NOW()),
('550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440007', '{"sub":"550e8400-e29b-41d4-a716-446655440007","email":"eva@example.com"}', 'email', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days', NOW()),
('550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440008', '{"sub":"550e8400-e29b-41d4-a716-446655440008","email":"frank@example.com"}', 'email', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', NOW()),
('550e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440009', '{"sub":"550e8400-e29b-41d4-a716-446655440009","email":"grace@example.com"}', 'email', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NOW()),
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440010', '{"sub":"550e8400-e29b-41d4-a716-446655440010","email":"henry@example.com"}', 'email', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW()),
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440011', '{"sub":"550e8400-e29b-41d4-a716-446655440011","email":"iris@example.com"}', 'email', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW()),
('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440012', '{"sub":"550e8400-e29b-41d4-a716-446655440012","email":"jack@example.com"}', 'email', NOW() - INTERVAL '18 hours', NOW() - INTERVAL '18 hours', NOW()),
('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440013', '{"sub":"550e8400-e29b-41d4-a716-446655440013","email":"kate@example.com"}', 'email', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '12 hours', NOW()),
('550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440014', '{"sub":"550e8400-e29b-41d4-a716-446655440014","email":"liam@example.com"}', 'email', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours', NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- USER PROFILES (Now we can create profiles since auth users exist)
-- ============================================================================

INSERT INTO user_profiles (id, full_name, email, phone, whatsapp, role, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'John Doe', 'john@example.com', '+923001234567', '+923001234567', 'customer', NOW() - INTERVAL '30 days'),
('550e8400-e29b-41d4-a716-446655440001', 'Jane Smith', 'jane@example.com', '+923001234568', '+923001234568', 'customer', NOW() - INTERVAL '25 days'),
('550e8400-e29b-41d4-a716-446655440002', 'Bob Johnson', 'bob@example.com', '+923001234569', '+923001234569', 'customer', NOW() - INTERVAL '20 days'),
('550e8400-e29b-41d4-a716-446655440003', 'Alice Brown', 'alice@example.com', '+923001234570', '+923001234570', 'customer', NOW() - INTERVAL '15 days'),
('550e8400-e29b-41d4-a716-446655440004', 'Charlie Wilson', 'charlie@example.com', '+923001234571', '+923001234571', 'customer', NOW() - INTERVAL '12 days'),
('550e8400-e29b-41d4-a716-446655440005', 'Diana Davis', 'diana@example.com', '+923001234572', '+923001234572', 'customer', NOW() - INTERVAL '10 days'),
('550e8400-e29b-41d4-a716-446655440006', 'Admin User', 'admin@mszecomstore.com', '+923001234573', '+923001234573', 'admin', NOW() - INTERVAL '60 days'),
('550e8400-e29b-41d4-a716-446655440007', 'Eva Martinez', 'eva@example.com', '+923001234574', '+923001234574', 'customer', NOW() - INTERVAL '8 days'),
('550e8400-e29b-41d4-a716-446655440008', 'Frank Garcia', 'frank@example.com', '+923001234575', '+923001234575', 'customer', NOW() - INTERVAL '5 days'),
('550e8400-e29b-41d4-a716-446655440009', 'Grace Lee', 'grace@example.com', '+923001234576', '+923001234576', 'customer', NOW() - INTERVAL '3 days'),
('550e8400-e29b-41d4-a716-446655440010', 'Henry Kim', 'henry@example.com', '+923001234577', '+923001234577', 'customer', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440011', 'Iris Chen', 'iris@example.com', '+923001234578', '+923001234578', 'customer', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440012', 'Jack Cooper', 'jack@example.com', '+923001234579', '+923001234579', 'customer', NOW() - INTERVAL '18 hours'),
('550e8400-e29b-41d4-a716-446655440013', 'Kate Lewis', 'kate@example.com', '+923001234580', '+923001234580', 'customer', NOW() - INTERVAL '12 hours'),
('550e8400-e29b-41d4-a716-446655440014', 'Liam Walker', 'liam@example.com', '+923001234581', '+923001234581', 'customer', NOW() - INTERVAL '6 hours')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SERVICES
-- ============================================================================

INSERT INTO services (name, category, description, icon_url, slug, long_description, display_order, is_active) VALUES
('Netflix Premium', 'streaming', 'Stream unlimited movies and TV shows in HD and 4K', '/icons/netflix.svg', 'netflix-premium', 'Get unlimited access to Netflix''s vast library of movies, TV shows, documentaries, and original content. Enjoy HD and 4K streaming on multiple devices with our premium subscription service. Watch award-winning series, blockbuster movies, and exclusive Netflix Originals.', 1, true),
('Spotify Premium', 'music', 'Ad-free music streaming with offline downloads', '/icons/spotify.svg', 'spotify-premium', 'Experience music like never before with Spotify Premium. Enjoy ad-free listening, offline downloads, and the highest quality audio streaming available. Access over 70 million songs and podcasts.', 2, true),
('YouTube Premium', 'streaming', 'Ad-free YouTube with background play and downloads', '/icons/youtube.svg', 'youtube-premium', 'Remove ads from YouTube, play videos in the background, and download videos for offline viewing with YouTube Premium. Includes YouTube Music Premium access.', 3, true),
('Disney+ Hotstar', 'streaming', 'Disney, Marvel, Star Wars, and live sports content', '/icons/disney.svg', 'disney-plus-hotstar', 'Dive into the magical world of Disney with access to thousands of movies and TV shows from Disney, Pixar, Marvel, Star Wars, and National Geographic. Plus watch live sports and exclusive Hotstar content.', 4, true),
('Amazon Prime Video', 'streaming', 'Exclusive originals and blockbuster movies', '/icons/amazon.svg', 'amazon-prime-video', 'Enjoy exclusive Amazon Originals, blockbuster movies, and popular TV series with Amazon Prime Video. Watch on any device, anytime, anywhere.', 5, true),
('Apple Music', 'music', 'Stream 100 million songs ad-free', '/icons/apple-music.svg', 'apple-music', 'Listen to 100 million songs ad-free. Download your favorites and listen offline. Get personalized recommendations and exclusive content.', 6, true),
('HBO Max', 'streaming', 'Premium HBO content and Warner Bros. movies', '/icons/hbo.svg', 'hbo-max', 'Access HBO''s award-winning series, blockbuster movies from Warner Bros., and exclusive Max Originals. Watch Game of Thrones, Friends, and more.', 7, true),
('Crunchyroll Premium', 'streaming', 'Anime and manga streaming platform', '/icons/crunchyroll.svg', 'crunchyroll-premium', 'Watch thousands of anime series and movies with Crunchyroll Premium. Get access to simulcasts, ad-free viewing, and exclusive content. Read manga online.', 8, true),
('Paramount+', 'streaming', 'CBS shows, live sports, and blockbuster movies', '/icons/paramount.svg', 'paramount-plus', 'Stream CBS shows, Paramount+ originals, and blockbuster movies from Paramount Pictures. Watch live sports including UEFA Champions League and NFL.', 9, true),
('Discovery+', 'streaming', 'Documentaries, reality TV, and lifestyle content', '/icons/discovery.svg', 'discovery-plus', 'Explore the world with Discovery+. Watch documentaries, reality TV, lifestyle shows from Discovery Channel, HGTV, Food Network, TLC, and more.', 10, true),
('Canva Pro', 'productivity', 'Professional graphic design tools', '/icons/canva.svg', 'canva-pro', 'Create stunning designs with Canva Pro. Access premium templates, stock photos, and advanced design tools. Perfect for professionals and businesses.', 11, true),
('Grammarly Premium', 'productivity', 'Advanced writing assistant and grammar checker', '/icons/grammarly.svg', 'grammarly-premium', 'Write with confidence using Grammarly Premium. Get advanced grammar checks, vocabulary suggestions, and plagiarism detection.', 12, true),
('LinkedIn Premium', 'professional', 'Professional networking and career development', '/icons/linkedin.svg', 'linkedin-premium', 'Unlock advanced LinkedIn features with Premium. See who viewed your profile, send InMail messages, and access exclusive career insights.', 13, true),
('Udemy Pro', 'education', 'Unlimited access to 10,000+ courses', '/icons/udemy.svg', 'udemy-pro', 'Learn anything with Udemy Pro. Get unlimited access to over 10,000 top-rated courses in technology, business, design, and more.', 14, true),
('Coursera Plus', 'education', 'University courses and professional certificates', '/icons/coursera.svg', 'coursera-plus', 'Access 7,000+ courses from world-class universities and companies. Earn certificates and advance your career with Coursera Plus.', 15, true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- PLANS (Basic, Standard, Premium for each service)
-- ============================================================================

-- Netflix Plans (Base: Rs 1200/month)
INSERT INTO plans (service_id, name, tier, type, duration_months, price, original_price, savings, features, is_available, is_popular, badge, display_order, description) VALUES
((SELECT id FROM services WHERE slug = 'netflix-premium'), 'Basic', 'basic', 'dedicated', 1, 1200, NULL, NULL, '["1 Month Access", "HD Quality", "2 Screens", "Cancel Anytime"]', true, false, NULL, 1, '1 month of Netflix Premium access'),
((SELECT id FROM services WHERE slug = 'netflix-premium'), 'Standard', 'standard', 'dedicated', 3, 3240, 3600, 360, '["3 Months Access", "HD Quality", "2 Screens", "Save 10%", "Cancel Anytime"]', true, true, 'popular', 2, '3 months of Netflix Premium access with 10% savings'),
((SELECT id FROM services WHERE slug = 'netflix-premium'), 'Premium', 'premium', 'dedicated', 12, 10800, 14400, 3600, '["12 Months Access", "4K Quality", "4 Screens", "Save 25%", "Best Value"]', true, false, 'best_value', 3, '12 months of Netflix Premium access with 25% savings')
ON CONFLICT DO NOTHING;

-- Spotify Plans (Base: Rs 900/month)
INSERT INTO plans (service_id, name, tier, type, duration_months, price, original_price, savings, features, is_available, is_popular, badge, display_order, description) VALUES
((SELECT id FROM services WHERE slug = 'spotify-premium'), 'Basic', 'basic', 'dedicated', 1, 900, NULL, NULL, '["1 Month Access", "Ad-Free", "Offline Download", "High Quality Audio"]', true, false, NULL, 1, '1 month of Spotify Premium access'),
((SELECT id FROM services WHERE slug = 'spotify-premium'), 'Standard', 'standard', 'dedicated', 3, 2430, 2700, 270, '["3 Months Access", "Ad-Free", "Offline Download", "Save 10%"]', true, true, 'popular', 2, '3 months of Spotify Premium access with 10% savings'),
((SELECT id FROM services WHERE slug = 'spotify-premium'), 'Premium', 'premium', 'dedicated', 12, 8100, 10800, 2700, '["12 Months Access", "Ad-Free", "Unlimited Skips", "Save 25%"]', true, false, 'best_value', 3, '12 months of Spotify Premium access with 25% savings')
ON CONFLICT DO NOTHING;

-- YouTube Premium Plans (Base: Rs 800/month)
INSERT INTO plans (service_id, name, tier, type, duration_months, price, original_price, savings, features, is_available, is_popular, badge, display_order, description) VALUES
((SELECT id FROM services WHERE slug = 'youtube-premium'), 'Basic', 'basic', 'dedicated', 1, 800, NULL, NULL, '["1 Month Access", "Ad-Free", "Background Play", "YouTube Music"]', true, false, NULL, 1, '1 month of YouTube Premium access'),
((SELECT id FROM services WHERE slug = 'youtube-premium'), 'Standard', 'standard', 'dedicated', 3, 2160, 2400, 240, '["3 Months Access", "Ad-Free", "Download Videos", "Save 10%"]', true, true, 'popular', 2, '3 months of YouTube Premium access with 10% savings'),
((SELECT id FROM services WHERE slug = 'youtube-premium'), 'Premium', 'premium', 'dedicated', 12, 7200, 9600, 2400, '["12 Months Access", "All Features", "Family Sharing", "Save 25%"]', true, false, 'best_value', 3, '12 months of YouTube Premium access with 25% savings')
ON CONFLICT DO NOTHING;

-- Disney+ Hotstar Plans (Base: Rs 1500/month)
INSERT INTO plans (service_id, name, tier, type, duration_months, price, original_price, savings, features, is_available, is_popular, badge, display_order, description) VALUES
((SELECT id FROM services WHERE slug = 'disney-plus-hotstar'), 'Basic', 'basic', 'dedicated', 1, 1500, NULL, NULL, '["1 Month Access", "4K Quality", "4 Devices", "Live Sports"]', true, false, NULL, 1, '1 month of Disney+ Hotstar Premium access'),
((SELECT id FROM services WHERE slug = 'disney-plus-hotstar'), 'Standard', 'standard', 'dedicated', 3, 4050, 4500, 450, '["3 Months Access", "4K Quality", "Live Cricket", "Save 10%"]', true, true, 'popular', 2, '3 months of Disney+ Hotstar Premium access with 10% savings'),
((SELECT id FROM services WHERE slug = 'disney-plus-hotstar'), 'Premium', 'premium', 'dedicated', 12, 13500, 18000, 4500, '["12 Months Access", "All Sports", "Dolby Atmos", "Save 25%"]', true, false, 'best_value', 3, '12 months of Disney+ Hotstar Premium access with 25% savings')
ON CONFLICT DO NOTHING;

-- Amazon Prime Video Plans (Base: Rs 1100/month)
INSERT INTO plans (service_id, name, tier, type, duration_months, price, original_price, savings, features, is_available, is_popular, badge, display_order, description) VALUES
((SELECT id FROM services WHERE slug = 'amazon-prime-video'), 'Basic', 'basic', 'dedicated', 1, 1100, NULL, NULL, '["1 Month Access", "HD Quality", "3 Devices", "Prime Originals"]', true, false, NULL, 1, '1 month of Amazon Prime Video access'),
((SELECT id FROM services WHERE slug = 'amazon-prime-video'), 'Standard', 'standard', 'dedicated', 3, 2970, 3300, 330, '["3 Months Access", "HD Quality", "Download", "Save 10%"]', true, true, 'popular', 2, '3 months of Amazon Prime Video access with 10% savings'),
((SELECT id FROM services WHERE slug = 'amazon-prime-video'), 'Premium', 'premium', 'dedicated', 12, 9900, 13200, 3300, '["12 Months Access", "4K Quality", "All Devices", "Save 25%"]', true, false, 'best_value', 3, '12 months of Amazon Prime Video access with 25% savings')
ON CONFLICT DO NOTHING;

-- Apple Music Plans (Base: Rs 850/month)
INSERT INTO plans (service_id, name, tier, type, duration_months, price, original_price, savings, features, is_available, is_popular, badge, display_order, description) VALUES
((SELECT id FROM services WHERE slug = 'apple-music'), 'Basic', 'basic', 'dedicated', 1, 850, NULL, NULL, '["1 Month Access", "100M Songs", "Lossless Audio", "Spatial Audio"]', true, false, NULL, 1, '1 month of Apple Music access'),
((SELECT id FROM services WHERE slug = 'apple-music'), 'Standard', 'standard', 'dedicated', 3, 2295, 2550, 255, '["3 Months Access", "All Features", "Offline Play", "Save 10%"]', true, true, 'popular', 2, '3 months of Apple Music access with 10% savings'),
((SELECT id FROM services WHERE slug = 'apple-music'), 'Premium', 'premium', 'dedicated', 12, 7650, 10200, 2550, '["12 Months Access", "Family Sharing", "Best Quality", "Save 25%"]', true, false, 'best_value', 3, '12 months of Apple Music access with 25% savings')
ON CONFLICT DO NOTHING;

-- HBO Max Plans (Base: Rs 1300/month)
INSERT INTO plans (service_id, name, tier, type, duration_months, price, original_price, savings, features, is_available, is_popular, badge, display_order, description) VALUES
((SELECT id FROM services WHERE slug = 'hbo-max'), 'Basic', 'basic', 'dedicated', 1, 1300, NULL, NULL, '["1 Month Access", "HD Quality", "All HBO Shows", "Warner Bros Movies"]', true, false, NULL, 1, '1 month of HBO Max access'),
((SELECT id FROM services WHERE slug = 'hbo-max'), 'Standard', 'standard', 'dedicated', 3, 3510, 3900, 390, '["3 Months Access", "4K Quality", "Download", "Save 10%"]', true, true, 'popular', 2, '3 months of HBO Max access with 10% savings'),
((SELECT id FROM services WHERE slug = 'hbo-max'), 'Premium', 'premium', 'dedicated', 12, 11700, 15600, 3900, '["12 Months Access", "All Devices", "Best Quality", "Save 25%"]', true, false, 'best_value', 3, '12 months of HBO Max access with 25% savings')
ON CONFLICT DO NOTHING;

-- Crunchyroll Premium Plans (Base: Rs 700/month)
INSERT INTO plans (service_id, name, tier, type, duration_months, price, original_price, savings, features, is_available, is_popular, badge, display_order, description) VALUES
((SELECT id FROM services WHERE slug = 'crunchyroll-premium'), 'Basic', 'basic', 'dedicated', 1, 700, NULL, NULL, '["1 Month Access", "Ad-Free Anime", "Simulcast", "Manga Access"]', true, false, NULL, 1, '1 month of Crunchyroll Premium access'),
((SELECT id FROM services WHERE slug = 'crunchyroll-premium'), 'Standard', 'standard', 'dedicated', 3, 1890, 2100, 210, '["3 Months Access", "HD Quality", "Offline View", "Save 10%"]', true, true, 'popular', 2, '3 months of Crunchyroll Premium access with 10% savings'),
((SELECT id FROM services WHERE slug = 'crunchyroll-premium'), 'Premium', 'premium', 'dedicated', 12, 6300, 8400, 2100, '["12 Months Access", "All Anime", "Exclusive Merch", "Save 25%"]', true, false, 'best_value', 3, '12 months of Crunchyroll Premium access with 25% savings')
ON CONFLICT DO NOTHING;

-- Paramount+ Plans (Base: Rs 950/month)
INSERT INTO plans (service_id, name, tier, type, duration_months, price, original_price, savings, features, is_available, is_popular, badge, display_order, description) VALUES
((SELECT id FROM services WHERE slug = 'paramount-plus'), 'Basic', 'basic', 'dedicated', 1, 950, NULL, NULL, '["1 Month Access", "Live TV", "CBS Shows", "Sports"]', true, false, NULL, 1, '1 month of Paramount+ access'),
((SELECT id FROM services WHERE slug = 'paramount-plus'), 'Standard', 'standard', 'dedicated', 3, 2565, 2850, 285, '["3 Months Access", "HD Quality", "Download", "Save 10%"]', true, true, 'popular', 2, '3 months of Paramount+ access with 10% savings'),
((SELECT id FROM services WHERE slug = 'paramount-plus'), 'Premium', 'premium', 'dedicated', 12, 8550, 11400, 2850, '["12 Months Access", "4K Quality", "No Ads", "Save 25%"]', true, false, 'best_value', 3, '12 months of Paramount+ access with 25% savings')
ON CONFLICT DO NOTHING;

-- Discovery+ Plans (Base: Rs 600/month)
INSERT INTO plans (service_id, name, tier, type, duration_months, price, original_price, savings, features, is_available, is_popular, badge, display_order, description) VALUES
((SELECT id FROM services WHERE slug = 'discovery-plus'), 'Basic', 'basic', 'dedicated', 1, 600, NULL, NULL, '["1 Month Access", "Ad-Free", "All Channels", "HD Quality"]', true, false, NULL, 1, '1 month of Discovery+ access'),
((SELECT id FROM services WHERE slug = 'discovery-plus'), 'Standard', 'standard', 'dedicated', 3, 1620, 1800, 180, '["3 Months Access", "All Content", "Download", "Save 10%"]', true, true, 'popular', 2, '3 months of Discovery+ access with 10% savings'),
((SELECT id FROM services WHERE slug = 'discovery-plus'), 'Premium', 'premium', 'dedicated', 12, 5400, 7200, 1800, '["12 Months Access", "4K Quality", "All Devices", "Save 25%"]', true, false, 'best_value', 3, '12 months of Discovery+ access with 25% savings')
ON CONFLICT DO NOTHING;

-- Canva Pro Plans (Base: Rs 1000/month)
INSERT INTO plans (service_id, name, tier, type, duration_months, price, original_price, savings, features, is_available, is_popular, badge, display_order, description) VALUES
((SELECT id FROM services WHERE slug = 'canva-pro'), 'Basic', 'basic', 'dedicated', 1, 1000, NULL, NULL, '["1 Month Access", "Premium Templates", "Brand Kit", "Magic Resize"]', true, false, NULL, 1, '1 month of Canva Pro access'),
((SELECT id FROM services WHERE slug = 'canva-pro'), 'Standard', 'standard', 'dedicated', 3, 2700, 3000, 300, '["3 Months Access", "All Features", "Team Collab", "Save 10%"]', true, true, 'popular', 2, '3 months of Canva Pro access with 10% savings'),
((SELECT id FROM services WHERE slug = 'canva-pro'), 'Premium', 'premium', 'dedicated', 12, 9000, 12000, 3000, '["12 Months Access", "Unlimited Storage", "Priority Support", "Save 25%"]', true, false, 'best_value', 3, '12 months of Canva Pro access with 25% savings')
ON CONFLICT DO NOTHING;

-- Grammarly Premium Plans (Base: Rs 1200/month)
INSERT INTO plans (service_id, name, tier, type, duration_months, price, original_price, savings, features, is_available, is_popular, badge, display_order, description) VALUES
((SELECT id FROM services WHERE slug = 'grammarly-premium'), 'Basic', 'basic', 'dedicated', 1, 1200, NULL, NULL, '["1 Month Access", "Advanced Grammar", "Plagiarism Check", "Tone Detector"]', true, false, NULL, 1, '1 month of Grammarly Premium access'),
((SELECT id FROM services WHERE slug = 'grammarly-premium'), 'Standard', 'standard', 'dedicated', 3, 3240, 3600, 360, '["3 Months Access", "All Features", "Multiple Devices", "Save 10%"]', true, true, 'popular', 2, '3 months of Grammarly Premium access with 10% savings'),
((SELECT id FROM services WHERE slug = 'grammarly-premium'), 'Premium', 'premium', 'dedicated', 12, 10800, 14400, 3600, '["12 Months Access", "Full Suite", "Priority Support", "Save 25%"]', true, false, 'best_value', 3, '12 months of Grammarly Premium access with 25% savings')
ON CONFLICT DO NOTHING;

-- LinkedIn Premium Plans (Base: Rs 1800/month)
INSERT INTO plans (service_id, name, tier, type, duration_months, price, original_price, savings, features, is_available, is_popular, badge, display_order, description) VALUES
((SELECT id FROM services WHERE slug = 'linkedin-premium'), 'Basic', 'basic', 'dedicated', 1, 1800, NULL, NULL, '["1 Month Access", "InMail Credits", "Profile Views", "Job Insights"]', true, false, NULL, 1, '1 month of LinkedIn Premium access'),
((SELECT id FROM services WHERE slug = 'linkedin-premium'), 'Standard', 'standard', 'dedicated', 3, 4860, 5400, 540, '["3 Months Access", "More InMails", "Advanced Search", "Save 10%"]', true, true, 'popular', 2, '3 months of LinkedIn Premium access with 10% savings'),
((SELECT id FROM services WHERE slug = 'linkedin-premium'), 'Premium', 'premium', 'dedicated', 12, 16200, 21600, 5400, '["12 Months Access", "Unlimited Search", "Learning Courses", "Save 25%"]', true, false, 'best_value', 3, '12 months of LinkedIn Premium access with 25% savings')
ON CONFLICT DO NOTHING;

-- Udemy Pro Plans (Base: Rs 1400/month)
INSERT INTO plans (service_id, name, tier, type, duration_months, price, original_price, savings, features, is_available, is_popular, badge, display_order, description) VALUES
((SELECT id FROM services WHERE slug = 'udemy-pro'), 'Basic', 'basic', 'dedicated', 1, 1400, NULL, NULL, '["1 Month Access", "10,000+ Courses", "Mobile Learning", "Certificates"]', true, false, NULL, 1, '1 month of Udemy Pro access'),
((SELECT id FROM services WHERE slug = 'udemy-pro'), 'Standard', 'standard', 'dedicated', 3, 3780, 4200, 420, '["3 Months Access", "All Courses", "Offline Access", "Save 10%"]', true, true, 'popular', 2, '3 months of Udemy Pro access with 10% savings'),
((SELECT id FROM services WHERE slug = 'udemy-pro'), 'Premium', 'premium', 'dedicated', 12, 12600, 16800, 4200, '["12 Months Access", "Priority Support", "Career Path", "Save 25%"]', true, false, 'best_value', 3, '12 months of Udemy Pro access with 25% savings')
ON CONFLICT DO NOTHING;

-- Coursera Plus Plans (Base: Rs 3500/month)
INSERT INTO plans (service_id, name, tier, type, duration_months, price, original_price, savings, features, is_available, is_popular, badge, display_order, description) VALUES
((SELECT id FROM services WHERE slug = 'coursera-plus'), 'Basic', 'basic', 'dedicated', 1, 3500, NULL, NULL, '["1 Month Access", "7,000+ Courses", "Certificates", "University Content"]', true, false, NULL, 1, '1 month of Coursera Plus access'),
((SELECT id FROM services WHERE slug = 'coursera-plus'), 'Standard', 'standard', 'dedicated', 3, 9450, 10500, 1050, '["3 Months Access", "All Courses", "Specializations", "Save 10%"]', true, true, 'popular', 2, '3 months of Coursera Plus access with 10% savings'),
((SELECT id FROM services WHERE slug = 'coursera-plus'), 'Premium', 'premium', 'dedicated', 12, 31500, 42000, 10500, '["12 Months Access", "Guided Projects", "Career Certificates", "Save 25%"]', true, false, 'best_value', 3, '12 months of Coursera Plus access with 25% savings')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SUBSCRIPTIONS (Active subscriptions for some users)
-- ============================================================================

INSERT INTO subscriptions (user_id, plan_id, credentials, status, started_at, expires_at) VALUES
-- John Doe - Netflix Premium plan
('550e8400-e29b-41d4-a716-446655440000', 
  (SELECT id FROM plans WHERE service_id = (SELECT id FROM services WHERE slug = 'netflix-premium') AND tier = 'premium' LIMIT 1), 
  '{"email": "john.netflix@temp.com", "password": "***HIDDEN***"}', 'active', NOW() - INTERVAL '2 months', NOW() + INTERVAL '10 months'),

-- Jane Smith - Spotify Standard plan
('550e8400-e29b-41d4-a716-446655440001', 
  (SELECT id FROM plans WHERE service_id = (SELECT id FROM services WHERE slug = 'spotify-premium') AND tier = 'standard' LIMIT 1), 
  '{"email": "jane.spotify@temp.com", "password": "***HIDDEN***"}', 'active', NOW() - INTERVAL '1 month', NOW() + INTERVAL '2 months'),

-- Bob Johnson - YouTube Basic plan
('550e8400-e29b-41d4-a716-446655440002', 
  (SELECT id FROM plans WHERE service_id = (SELECT id FROM services WHERE slug = 'youtube-premium') AND tier = 'basic' LIMIT 1), 
  '{"email": "bob.youtube@temp.com", "password": "***HIDDEN***"}', 'active', NOW() - INTERVAL '15 days', NOW() + INTERVAL '15 days'),

-- Alice Brown - Disney+ Premium plan
('550e8400-e29b-41d4-a716-446655440003', 
  (SELECT id FROM plans WHERE service_id = (SELECT id FROM services WHERE slug = 'disney-plus-hotstar') AND tier = 'premium' LIMIT 1), 
  '{"email": "alice.disney@temp.com", "password": "***HIDDEN***"}', 'active', NOW() - INTERVAL '1 month', NOW() + INTERVAL '11 months'),

-- Charlie Wilson - Amazon Prime Standard plan
('550e8400-e29b-41d4-a716-446655440004', 
  (SELECT id FROM plans WHERE service_id = (SELECT id FROM services WHERE slug = 'amazon-prime-video') AND tier = 'standard' LIMIT 1), 
  '{"email": "charlie.prime@temp.com", "password": "***HIDDEN***"}', 'active', NOW() - INTERVAL '20 days', NOW() + INTERVAL '70 days'),

-- Diana Davis - Apple Music Basic plan
('550e8400-e29b-41d4-a716-446655440005', 
  (SELECT id FROM plans WHERE service_id = (SELECT id FROM services WHERE slug = 'apple-music') AND tier = 'basic' LIMIT 1), 
  '{"account": "diana.apple@temp.com", "password": "***HIDDEN***"}', 'active', NOW() - INTERVAL '10 days', NOW() + INTERVAL '20 days'),

-- Eva Martinez - HBO Max Standard plan
('550e8400-e29b-41d4-a716-446655440007', 
  (SELECT id FROM plans WHERE service_id = (SELECT id FROM services WHERE slug = 'hbo-max') AND tier = 'standard' LIMIT 1), 
  '{"email": "eva.hbo@temp.com", "password": "***HIDDEN***"}', 'active', NOW() - INTERVAL '25 days', NOW() + INTERVAL '65 days'),

-- Frank Garcia - Crunchyroll Premium plan
('550e8400-e29b-41d4-a716-446655440008', 
  (SELECT id FROM plans WHERE service_id = (SELECT id FROM services WHERE slug = 'crunchyroll-premium') AND tier = 'premium' LIMIT 1), 
  '{"username": "frank_anime", "password": "***HIDDEN***"}', 'active', NOW() - INTERVAL '3 months', NOW() + INTERVAL '9 months'),

-- Grace Lee - Canva Pro Basic plan (expired)
('550e8400-e29b-41d4-a716-446655440009', 
  (SELECT id FROM plans WHERE service_id = (SELECT id FROM services WHERE slug = 'canva-pro') AND tier = 'basic' LIMIT 1), 
  '{"email": "grace.canva@temp.com", "password": "***HIDDEN***"}', 'expired', NOW() - INTERVAL '2 months', NOW() - INTERVAL '1 month'),

-- Henry Kim - LinkedIn Premium Standard plan
('550e8400-e29b-41d4-a716-446655440010', 
  (SELECT id FROM plans WHERE service_id = (SELECT id FROM services WHERE slug = 'linkedin-premium') AND tier = 'standard' LIMIT 1), 
  '{"email": "henry.linkedin@temp.com", "password": "***HIDDEN***"}', 'active', NOW() - INTERVAL '1 month', NOW() + INTERVAL '2 months')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- ORDERS (Purchase history with various states)
-- ============================================================================

INSERT INTO orders (user_id, plan_id, amount, customer_name, customer_email, customer_whatsapp, status, created_at) VALUES
-- John Doe - Netflix Premium (completed)
('550e8400-e29b-41d4-a716-446655440000', 
  (SELECT id FROM plans WHERE service_id = (SELECT id FROM services WHERE slug = 'netflix-premium') AND tier = 'premium' LIMIT 1), 
  7499, 'John Doe', 'john@example.com', '+923001234567', 'delivered', NOW() - INTERVAL '2 months'),

-- Jane Smith - Spotify Standard (completed)
('550e8400-e29b-41d4-a716-446655440001', 
  (SELECT id FROM plans WHERE service_id = (SELECT id FROM services WHERE slug = 'spotify-premium') AND tier = 'standard' LIMIT 1), 
  809, 'Jane Smith', 'jane@example.com', '+923001234568', 'delivered', NOW() - INTERVAL '1 month'),

-- Bob Johnson - YouTube Basic (completed)
('550e8400-e29b-41d4-a716-446655440002', 
  (SELECT id FROM plans WHERE service_id = (SELECT id FROM services WHERE slug = 'youtube-premium') AND tier = 'basic' LIMIT 1), 
  450, 'Bob Johnson', 'bob@example.com', '+923001234569', 'delivered', NOW() - INTERVAL '15 days'),

-- Alice Brown - Disney+ Premium (completed)
('550e8400-e29b-41d4-a716-446655440003', 
  (SELECT id FROM plans WHERE service_id = (SELECT id FROM services WHERE slug = 'disney-plus-hotstar') AND tier = 'premium' LIMIT 1), 
  11999, 'Alice Brown', 'alice@example.com', '+923001234570', 'delivered', NOW() - INTERVAL '1 month'),

-- Charlie Wilson - Amazon Prime Standard (completed)
('550e8400-e29b-41d4-a716-446655440004', 
  (SELECT id FROM plans WHERE service_id = (SELECT id FROM services WHERE slug = 'amazon-prime-video') AND tier = 'standard' LIMIT 1), 
  2699, 'Charlie Wilson', 'charlie@example.com', '+923001234571', 'delivered', NOW() - INTERVAL '20 days'),

-- Diana Davis - Apple Music Basic (completed)
('550e8400-e29b-41d4-a716-446655440005', 
  (SELECT id FROM plans WHERE service_id = (SELECT id FROM services WHERE slug = 'apple-music') AND tier = 'basic' LIMIT 1), 
  299, 'Diana Davis', 'diana@example.com', '+923001234572', 'delivered', NOW() - INTERVAL '10 days'),

-- Eva Martinez - HBO Max Standard (completed)
('550e8400-e29b-41d4-a716-446655440007', 
  (SELECT id FROM plans WHERE service_id = (SELECT id FROM services WHERE slug = 'hbo-max') AND tier = 'standard' LIMIT 1), 
  2699, 'Eva Martinez', 'eva@example.com', '+923001234574', 'delivered', NOW() - INTERVAL '25 days'),

-- Frank Garcia - Crunchyroll Premium (completed)
('550e8400-e29b-41d4-a716-446655440008', 
  (SELECT id FROM plans WHERE service_id = (SELECT id FROM services WHERE slug = 'crunchyroll-premium') AND tier = 'premium' LIMIT 1), 
  7499, 'Frank Garcia', 'frank@example.com', '+923001234575', 'delivered', NOW() - INTERVAL '3 months'),

-- Grace Lee - Canva Pro Basic (completed, but subscription expired)
('550e8400-e29b-41d4-a716-446655440009', 
  (SELECT id FROM plans WHERE service_id = (SELECT id FROM services WHERE slug = 'canva-pro') AND tier = 'basic' LIMIT 1), 
  499, 'Grace Lee', 'grace@example.com', '+923001234576', 'delivered', NOW() - INTERVAL '2 months'),

-- Henry Kim - LinkedIn Premium Standard (completed)
('550e8400-e29b-41d4-a716-446655440010', 
  (SELECT id FROM plans WHERE service_id = (SELECT id FROM services WHERE slug = 'linkedin-premium') AND tier = 'standard' LIMIT 1), 
  2699, 'Henry Kim', 'henry@example.com', '+923001234577', 'delivered', NOW() - INTERVAL '1 month'),

-- Bob Johnson - Second order for Disney+ (processing)
('550e8400-e29b-41d4-a716-446655440002', 
  (SELECT id FROM plans WHERE service_id = (SELECT id FROM services WHERE slug = 'disney-plus-hotstar') AND tier = 'basic' LIMIT 1), 
  999, 'Bob Johnson', 'bob@example.com', '+923001234569', 'processing', NOW() - INTERVAL '2 days'),

-- Jane Smith - Second order for Netflix (completed)
('550e8400-e29b-41d4-a716-446655440001', 
  (SELECT id FROM plans WHERE service_id = (SELECT id FROM services WHERE slug = 'netflix-premium') AND tier = 'standard' LIMIT 1), 
  1999, 'Jane Smith', 'jane@example.com', '+923001234568', 'processing', NOW() - INTERVAL '5 days'),

-- Alice Brown - Second order for YouTube (pending)
('550e8400-e29b-41d4-a716-446655440003', 
  (SELECT id FROM plans WHERE service_id = (SELECT id FROM services WHERE slug = 'youtube-premium') AND tier = 'standard' LIMIT 1), 
  1349, 'Alice Brown', 'alice@example.com', '+923001234570', 'pending', NOW() - INTERVAL '1 day'),

-- Charlie Wilson - Second order for Spotify (cancelled)
('550e8400-e29b-41d4-a716-446655440004', 
  (SELECT id FROM plans WHERE service_id = (SELECT id FROM services WHERE slug = 'spotify-premium') AND tier = 'basic' LIMIT 1), 
  299, 'Charlie Wilson', 'charlie@example.com', '+923001234571', 'cancelled', NOW() - INTERVAL '3 days'),

-- John Doe - Second order for HBO Max Premium (completed)
('550e8400-e29b-41d4-a716-446655440000', 
  (SELECT id FROM plans WHERE service_id = (SELECT id FROM services WHERE slug = 'hbo-max') AND tier = 'premium' LIMIT 1), 
  8999, 'John Doe', 'john@example.com', '+923001234567', 'completed', NOW() - INTERVAL '1 week')
ON CONFLICT DO NOTHING;