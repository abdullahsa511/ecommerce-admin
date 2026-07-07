#!/bin/bash

# Database connection details
DB_HOST="km3-production-db.kingmaker.ninja"
DB_PORT="3306"
DB_USER="superuser"
DB_PASSWORD="6ap5NENd#EyPsQHL"
DB_NAME="kingmaker_ninja"

# Output file
OUTPUT_FILE="data.csv"

# Clear the output file
> "$OUTPUT_FILE"

echo "Starting data export from $DB_NAME database..."

# Add header to the output file
cat << 'EOF' >> "$OUTPUT_FILE"
-- Data export from kingmaker_ninja database
-- Generated on $(date)
-- This file contains sample data from all tables (latest 50 records each)

EOF

# Create a temporary SQL file with all queries
TEMP_SQL="temp_queries.sql"
> "$TEMP_SQL"

# Add all the SELECT queries to the temporary file
cat << 'EOF' >> "$TEMP_SQL"
-- Sample data for: adjustments
SELECT * FROM adjustments ORDER BY id DESC LIMIT 50;

-- Sample data for: areas
SELECT * FROM areas ORDER BY id DESC LIMIT 50;

-- Sample data for: automations
SELECT * FROM automations ORDER BY id DESC LIMIT 50;

-- Sample data for: bill_allocations
SELECT * FROM bill_allocations ORDER BY id DESC LIMIT 50;

-- Sample data for: billing_shippings
SELECT * FROM billing_shippings ORDER BY id DESC LIMIT 50;

-- Sample data for: board_forecasts
SELECT * FROM board_forecasts ORDER BY id DESC LIMIT 50;

-- Sample data for: board_forecasts_ois
SELECT * FROM board_forecasts_ois ORDER BY id DESC LIMIT 50;

-- Sample data for: board_forecasts_tlfs
SELECT * FROM board_forecasts_tlfs ORDER BY id DESC LIMIT 50;

-- Sample data for: board_translations
SELECT * FROM board_translations ORDER BY id DESC LIMIT 50;

-- Sample data for: buildings
SELECT * FROM buildings ORDER BY id DESC LIMIT 50;

-- Sample data for: buildings_attachments
SELECT * FROM buildings_attachments ORDER BY id DESC LIMIT 50;

-- Sample data for: buildings_images
SELECT * FROM buildings_images ORDER BY id DESC LIMIT 50;

-- Sample data for: carriers
SELECT * FROM carriers ORDER BY id DESC LIMIT 50;

-- Sample data for: carriers_areas
SELECT * FROM carriers_areas ORDER BY carrier_id DESC, area_id DESC LIMIT 50;

-- Sample data for: carriers_options
SELECT * FROM carriers_options ORDER BY id DESC LIMIT 50;

-- Sample data for: carriers_packages
SELECT * FROM carriers_packages ORDER BY id DESC LIMIT 50;

-- Sample data for: carriers_vehicle_types
SELECT * FROM carriers_vehicle_types ORDER BY carrier_id DESC, vehicle_type_id DESC LIMIT 50;

-- Sample data for: columns
SELECT * FROM columns ORDER BY id DESC LIMIT 50;

-- Sample data for: comments
SELECT * FROM comments ORDER BY id DESC LIMIT 50;

-- Sample data for: comments_attachments
SELECT * FROM comments_attachments ORDER BY id DESC LIMIT 50;

-- Sample data for: comments_mentions
SELECT * FROM comments_mentions ORDER BY id DESC LIMIT 50;

-- Sample data for: comments_replies
SELECT * FROM comments_replies ORDER BY parent_id DESC, child_id DESC LIMIT 50;

-- Sample data for: comments_upvotes
SELECT * FROM comments_upvotes ORDER BY id DESC LIMIT 50;

-- Sample data for: companies
SELECT * FROM companies ORDER BY id DESC LIMIT 50;

-- Sample data for: consolidation_transactions
SELECT * FROM consolidation_transactions ORDER BY id DESC LIMIT 50;

-- Sample data for: contacts_mailing_lists
SELECT * FROM contacts_mailing_lists ORDER BY id DESC LIMIT 50;

-- Sample data for: cron_logs
SELECT * FROM cron_logs ORDER BY id DESC LIMIT 50;

-- Sample data for: customers_credits
SELECT * FROM customers_credits ORDER BY id DESC LIMIT 50;

-- Sample data for: customers_emails
SELECT * FROM customers_emails ORDER BY id DESC LIMIT 50;

-- Sample data for: dashboard_reports
SELECT * FROM dashboard_reports ORDER BY id DESC LIMIT 50;

-- Sample data for: dashboards
SELECT * FROM dashboards ORDER BY id DESC LIMIT 50;

-- Sample data for: delivery_options
SELECT * FROM delivery_options ORDER BY id DESC LIMIT 50;

-- Sample data for: departments
SELECT * FROM departments ORDER BY id DESC LIMIT 50;

-- Sample data for: deposit_logs
SELECT * FROM deposit_logs ORDER BY id DESC LIMIT 50;

-- Sample data for: directpurchase_orders
SELECT * FROM directpurchase_orders ORDER BY id DESC LIMIT 50;

-- Sample data for: dispatch_locations
SELECT * FROM dispatch_locations ORDER BY id DESC LIMIT 50;

-- Sample data for: docks
SELECT * FROM docks ORDER BY id DESC LIMIT 50;

-- Sample data for: documents_emails
SELECT * FROM documents_emails ORDER BY id DESC LIMIT 50;

-- Sample data for: documents_smss
SELECT * FROM documents_smss ORDER BY id DESC LIMIT 50;

-- Sample data for: dpo_items_warehouses_update
SELECT * FROM dpo_items_warehouses_update ORDER BY id DESC LIMIT 50;

-- Sample data for: drawing_document_types
SELECT * FROM drawing_document_types ORDER BY id DESC LIMIT 50;

-- Sample data for: drawing_statuses
SELECT * FROM drawing_statuses ORDER BY id DESC LIMIT 50;

-- Sample data for: drawing_types
SELECT * FROM drawing_types ORDER BY id DESC LIMIT 50;

-- Sample data for: drawings
SELECT * FROM drawings ORDER BY id DESC LIMIT 50;

-- Sample data for: drawings_documents
SELECT * FROM drawings_documents ORDER BY id DESC LIMIT 50;

-- Sample data for: drawings_linked_documents
SELECT * FROM drawings_linked_documents ORDER BY id DESC LIMIT 50;

-- Sample data for: drawings_revisions
SELECT * FROM drawings_revisions ORDER BY id DESC LIMIT 50;

-- Sample data for: drawings_source_documents
SELECT * FROM drawings_source_documents ORDER BY id DESC LIMIT 50;

-- Sample data for: drawings_tags
SELECT * FROM drawings_tags ORDER BY id DESC LIMIT 50;

-- Sample data for: edgetape_colours
SELECT * FROM edgetape_colours ORDER BY id DESC LIMIT 50;

-- Sample data for: editor_shared_templates
SELECT * FROM editor_shared_templates ORDER BY id DESC LIMIT 50;

-- Sample data for: editor_templates
SELECT * FROM editor_templates ORDER BY id DESC LIMIT 50;

-- Sample data for: email_attachments
SELECT * FROM email_attachments ORDER BY id DESC LIMIT 50;

-- Sample data for: emails
SELECT * FROM emails ORDER BY id DESC LIMIT 50;

-- Sample data for: events
SELECT * FROM events ORDER BY id DESC LIMIT 50;

-- Sample data for: failed_jobs
SELECT * FROM failed_jobs ORDER BY id DESC LIMIT 50;

-- Sample data for: faq_categories
SELECT * FROM faq_categories ORDER BY id DESC LIMIT 50;

-- Sample data for: faq_questions
SELECT * FROM faq_questions ORDER BY id DESC LIMIT 50;

-- Sample data for: faq_tags
SELECT * FROM faq_tags ORDER BY id DESC LIMIT 50;

-- Sample data for: faqs_tags
SELECT * FROM faqs_tags ORDER BY faq_id DESC, tag_id DESC LIMIT 50;

-- Sample data for: freight_documents
SELECT * FROM freight_documents ORDER BY id DESC LIMIT 50;

-- Sample data for: freight_documents_requests
SELECT * FROM freight_documents_requests ORDER BY id DESC LIMIT 50;

-- Sample data for: freight_items
SELECT * FROM freight_items ORDER BY id DESC LIMIT 50;

-- Sample data for: freight_quotes
SELECT * FROM freight_quotes ORDER BY id DESC LIMIT 50;

-- Sample data for: generated_reports
SELECT * FROM generated_reports ORDER BY id DESC LIMIT 50;

-- Sample data for: global_configurations
SELECT * FROM global_configurations ORDER BY id DESC LIMIT 50;

-- Sample data for: global_dates
SELECT * FROM global_dates ORDER BY id DESC LIMIT 50;

-- Sample data for: global_fields
SELECT * FROM global_fields ORDER BY id DESC LIMIT 50;

-- Sample data for: global_prices
SELECT * FROM global_prices ORDER BY id DESC LIMIT 50;

-- Sample data for: global_statuses
SELECT * FROM global_statuses ORDER BY id DESC LIMIT 50;

-- Sample data for: holidays
SELECT * FROM holidays ORDER BY id DESC LIMIT 50;

-- Sample data for: invoice_allocations
SELECT * FROM invoice_allocations ORDER BY id DESC LIMIT 50;

-- Sample data for: invoices
SELECT * FROM invoices ORDER BY id DESC LIMIT 50;

-- Sample data for: invoices_logs
SELECT * FROM invoices_logs ORDER BY id DESC LIMIT 50;

-- Sample data for: item_categories
SELECT * FROM item_categories ORDER BY id DESC LIMIT 50;

-- Sample data for: item_ranges
SELECT * FROM item_ranges ORDER BY id DESC LIMIT 50;

-- Sample data for: item_types
SELECT * FROM item_types ORDER BY id DESC LIMIT 50;

-- Sample data for: items
SELECT * FROM items ORDER BY id DESC LIMIT 50;

-- Sample data for: items_classes
SELECT * FROM items_classes ORDER BY id DESC LIMIT 50;

-- Sample data for: items_classes_configurations
SELECT * FROM items_classes_configurations ORDER BY class_id DESC, configuration_id DESC LIMIT 50;

-- Sample data for: items_classes_dates
SELECT * FROM items_classes_dates ORDER BY class_id DESC, date_id DESC, dispatch_location_id DESC LIMIT 50;

-- Sample data for: items_classes_statuses
SELECT * FROM items_classes_statuses ORDER BY class_id DESC, status_id DESC LIMIT 50;

-- Sample data for: items_components
SELECT * FROM items_components ORDER BY item_id DESC, component_id DESC LIMIT 50;

-- Sample data for: items_configurations
SELECT * FROM items_configurations ORDER BY item_id DESC, configuration_id DESC LIMIT 50;

-- Sample data for: items_dates
SELECT * FROM items_dates ORDER BY item_id DESC, date_id DESC, dispatch_location_id DESC LIMIT 50;

-- Sample data for: items_disputes
SELECT * FROM items_disputes ORDER BY id DESC LIMIT 50;

-- Sample data for: items_prices
SELECT * FROM items_prices ORDER BY item_id DESC, price_id DESC LIMIT 50;

-- Sample data for: items_statuses
SELECT * FROM items_statuses ORDER BY item_id DESC, status_id DESC LIMIT 50;

-- Sample data for: items_warehouses
SELECT * FROM items_warehouses ORDER BY id DESC LIMIT 50;

-- Sample data for: items_workcenters
SELECT * FROM items_workcenters ORDER BY item_id DESC, workcenter_id DESC LIMIT 50;

-- Sample data for: jasper_reports
SELECT * FROM jasper_reports ORDER BY id DESC LIMIT 50;

-- Sample data for: job_reviews
SELECT * FROM job_reviews ORDER BY id DESC LIMIT 50;

-- Sample data for: jobs
SELECT * FROM jobs ORDER BY id DESC LIMIT 50;

-- Sample data for: jobs_forecasted_costs
SELECT * FROM jobs_forecasted_costs ORDER BY id DESC LIMIT 50;

-- Sample data for: kardex_items
SELECT * FROM kardex_items ORDER BY id DESC LIMIT 50;

-- Sample data for: lead_resources
SELECT * FROM lead_resources ORDER BY id DESC LIMIT 50;

-- Sample data for: leads
SELECT * FROM leads ORDER BY id DESC LIMIT 50;

-- Sample data for: logistic_attachments
SELECT * FROM logistic_attachments ORDER BY id DESC LIMIT 50;

-- Sample data for: logistic_dates
SELECT * FROM logistic_dates ORDER BY id DESC LIMIT 50;

-- Sample data for: logistic_resources
SELECT * FROM logistic_resources ORDER BY id DESC LIMIT 50;

-- Sample data for: logistic_serviceunits
SELECT * FROM logistic_serviceunits ORDER BY id DESC LIMIT 50;

-- Sample data for: logistic_statuses
SELECT * FROM logistic_statuses ORDER BY id DESC LIMIT 50;

-- Sample data for: logistic_types
SELECT * FROM logistic_types ORDER BY id DESC LIMIT 50;

-- Sample data for: mailing_lists
SELECT * FROM mailing_lists ORDER BY id DESC LIMIT 50;

-- Sample data for: manufacturing_stocks
SELECT * FROM manufacturing_stocks ORDER BY id DESC LIMIT 50;

-- Sample data for: material_colours
SELECT * FROM material_colours ORDER BY id DESC LIMIT 50;

-- Sample data for: menus
SELECT * FROM menus ORDER BY id DESC LIMIT 50;

-- Sample data for: migrations
SELECT * FROM migrations ORDER BY id DESC LIMIT 50;

-- Sample data for: model_has_buildings
SELECT * FROM model_has_buildings ORDER BY building_id DESC, model_id DESC LIMIT 50;

-- Sample data for: model_has_comments
SELECT * FROM model_has_comments ORDER BY comment_id DESC, model_id DESC LIMIT 50;

-- Sample data for: model_has_followers
SELECT * FROM model_has_followers ORDER BY user_id DESC, model_id DESC LIMIT 50;

-- Sample data for: model_has_permissions
SELECT * FROM model_has_permissions ORDER BY permission_id DESC, model_id DESC LIMIT 50;

-- Sample data for: model_has_roles
SELECT * FROM model_has_roles ORDER BY role_id DESC, model_id DESC LIMIT 50;

-- Sample data for: oauth_access_tokens
SELECT * FROM oauth_access_tokens ORDER BY created_at DESC LIMIT 50;

-- Sample data for: oauth_auth_codes
SELECT * FROM oauth_auth_codes ORDER BY expires_at DESC LIMIT 50;

-- Sample data for: oauth_clients
SELECT * FROM oauth_clients ORDER BY id DESC LIMIT 50;

-- Sample data for: oauth_personal_access_clients
SELECT * FROM oauth_personal_access_clients ORDER BY id DESC LIMIT 50;

-- Sample data for: oauth_refresh_tokens
SELECT * FROM oauth_refresh_tokens ORDER BY expires_at DESC LIMIT 50;

-- Sample data for: orders
SELECT * FROM orders ORDER BY id DESC LIMIT 50;

-- Sample data for: orders_items
SELECT * FROM orders_items ORDER BY id DESC LIMIT 50;

-- Sample data for: orders_items_components
SELECT * FROM orders_items_components ORDER BY id DESC LIMIT 50;

-- Sample data for: orders_items_dates
SELECT * FROM orders_items_dates ORDER BY id DESC LIMIT 50;

-- Sample data for: orders_items_prices
SELECT * FROM orders_items_prices ORDER BY id DESC LIMIT 50;

-- Sample data for: orders_items_statuses
SELECT * FROM orders_items_statuses ORDER BY id DESC LIMIT 50;

-- Sample data for: orders_site_contacts
SELECT * FROM orders_site_contacts ORDER BY id DESC LIMIT 50;

-- Sample data for: org_contacts
SELECT * FROM org_contacts ORDER BY id DESC LIMIT 50;

-- Sample data for: organisations
SELECT * FROM organisations ORDER BY id DESC LIMIT 50;

-- Sample data for: organisations_statements
SELECT * FROM organisations_statements ORDER BY id DESC LIMIT 50;

-- Sample data for: packages
SELECT * FROM packages ORDER BY id DESC LIMIT 50;

-- Sample data for: pallets
SELECT * FROM pallets ORDER BY id DESC LIMIT 50;

-- Sample data for: pallets_parts
SELECT * FROM pallets_parts ORDER BY id DESC LIMIT 50;

-- Sample data for: payment_methods
SELECT * FROM payment_methods ORDER BY id DESC LIMIT 50;

-- Sample data for: paypal_transactions
SELECT * FROM paypal_transactions ORDER BY id DESC LIMIT 50;

-- Sample data for: permissions
SELECT * FROM permissions ORDER BY id DESC LIMIT 50;

-- Sample data for: personal_access_tokens
SELECT * FROM personal_access_tokens ORDER BY id DESC LIMIT 50;

-- Sample data for: pickfaces
SELECT * FROM pickfaces ORDER BY id DESC LIMIT 50;

-- Sample data for: pickfaces_parts
SELECT * FROM pickfaces_parts ORDER BY id DESC LIMIT 50;

-- Sample data for: price_lists
SELECT * FROM price_lists ORDER BY id DESC LIMIT 50;

-- Sample data for: purchase_orders
SELECT * FROM purchase_orders ORDER BY id DESC LIMIT 50;

-- Sample data for: purchase_orders_responsibles
SELECT * FROM purchase_orders_responsibles ORDER BY id DESC LIMIT 50;

-- Sample data for: quotes
SELECT * FROM quotes ORDER BY id DESC LIMIT 50;

-- Sample data for: quotes_items
SELECT * FROM quotes_items ORDER BY id DESC LIMIT 50;

-- Sample data for: quotes_items_components
SELECT * FROM quotes_items_components ORDER BY id DESC LIMIT 50;

-- Sample data for: rating_ranks
SELECT * FROM rating_ranks ORDER BY id DESC LIMIT 50;

-- Sample data for: reports_generations
SELECT * FROM reports_generations ORDER BY id DESC LIMIT 50;

-- Sample data for: role_has_permissions
SELECT * FROM role_has_permissions ORDER BY permission_id DESC, role_id DESC LIMIT 50;

-- Sample data for: roles
SELECT * FROM roles ORDER BY id DESC LIMIT 50;

-- Sample data for: roles_saved_searches
SELECT * FROM roles_saved_searches ORDER BY id DESC LIMIT 50;

-- Sample data for: saved_searches
SELECT * FROM saved_searches ORDER BY id DESC LIMIT 50;

-- Sample data for: segments
SELECT * FROM segments ORDER BY id DESC LIMIT 50;

-- Sample data for: signatures
SELECT * FROM signatures ORDER BY id DESC LIMIT 50;

-- Sample data for: statuses
SELECT * FROM statuses ORDER BY id DESC LIMIT 50;

-- Sample data for: sub_events
SELECT * FROM sub_events ORDER BY id DESC LIMIT 50;

-- Sample data for: suburbs
SELECT * FROM suburbs ORDER BY id DESC LIMIT 50;

-- Sample data for: tags
SELECT * FROM tags ORDER BY id DESC LIMIT 50;

-- Sample data for: templates
SELECT * FROM templates ORDER BY id DESC LIMIT 50;

-- Sample data for: templates_bodies
SELECT * FROM templates_bodies ORDER BY id DESC LIMIT 50;

-- Sample data for: templates_files
SELECT * FROM templates_files ORDER BY id DESC LIMIT 50;

-- Sample data for: terms
SELECT * FROM terms ORDER BY id DESC LIMIT 50;

-- Sample data for: tmp_oi_logistic_dates_update
SELECT * FROM tmp_oi_logistic_dates_update ORDER BY id DESC LIMIT 50;

-- Sample data for: transfers
SELECT * FROM transfers ORDER BY id DESC LIMIT 50;

-- Sample data for: users
SELECT * FROM users ORDER BY id DESC LIMIT 50;

-- Sample data for: users_saved_searches
SELECT * FROM users_saved_searches ORDER BY id DESC LIMIT 50;

-- Sample data for: users_shared_searches
SELECT * FROM users_shared_searches ORDER BY user_id DESC, saved_search_id DESC LIMIT 50;

-- Sample data for: variables
SELECT * FROM variables ORDER BY id DESC LIMIT 50;

-- Sample data for: vehicle_types
SELECT * FROM vehicle_types ORDER BY id DESC LIMIT 50;

-- Sample data for: vendor_contacts
SELECT * FROM vendor_contacts ORDER BY id DESC LIMIT 50;

-- Sample data for: vendor_xero_configs
SELECT * FROM vendor_xero_configs ORDER BY id DESC LIMIT 50;

-- Sample data for: vendors
SELECT * FROM vendors ORDER BY id DESC LIMIT 50;

-- Sample data for: vendors_deposits
SELECT * FROM vendors_deposits ORDER BY id DESC LIMIT 50;

-- Sample data for: views
SELECT * FROM views ORDER BY id DESC LIMIT 50;

-- Sample data for: views_fields
SELECT * FROM views_fields ORDER BY id DESC LIMIT 50;

-- Sample data for: warehouse_locations
SELECT * FROM warehouse_locations ORDER BY id DESC LIMIT 50;

-- Sample data for: warehouse_transactions
SELECT * FROM warehouse_transactions ORDER BY id DESC LIMIT 50;

-- Sample data for: warehouses
SELECT * FROM warehouses ORDER BY id DESC LIMIT 50;

-- Sample data for: warranty_repairs
SELECT * FROM warranty_repairs ORDER BY id DESC LIMIT 50;

-- Sample data for: warranty_repairs_files
SELECT * FROM warranty_repairs_files ORDER BY id DESC LIMIT 50;

-- Sample data for: websockets_statistics_entries
SELECT * FROM websockets_statistics_entries ORDER BY id DESC LIMIT 50;

-- Sample data for: workcenter_capacities
SELECT * FROM workcenter_capacities ORDER BY id DESC LIMIT 50;

-- Sample data for: workcenter_items
SELECT * FROM workcenter_items ORDER BY id DESC LIMIT 50;

-- Sample data for: workcenter_shutdowns
SELECT * FROM workcenter_shutdowns ORDER BY id DESC LIMIT 50;

-- Sample data for: workcenters
SELECT * FROM workcenters ORDER BY id DESC LIMIT 50;

-- Sample data for: xero_auths
SELECT * FROM xero_auths ORDER BY id DESC LIMIT 50;

-- Sample data for: zoho_auths
SELECT * FROM zoho_auths ORDER BY id DESC LIMIT 50;

-- Sample data for: zoho_bank_transactions
SELECT * FROM zoho_bank_transactions ORDER BY id DESC LIMIT 50;
EOF

# Execute the queries and save results to the output file
echo "Executing queries and exporting data..."
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" \
    "$DB_NAME" < "$TEMP_SQL" >> "$OUTPUT_FILE" 2>/dev/null

# Clean up temporary file
rm -f "$TEMP_SQL"

echo "Data export completed! Results saved to $OUTPUT_FILE"
echo "Total tables processed: 150+"
