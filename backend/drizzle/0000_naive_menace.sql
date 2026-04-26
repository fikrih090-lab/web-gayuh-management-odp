-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `bank` (
	`bank_id` int(11) AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`no_rek` varchar(128) NOT NULL,
	`owner` varchar(128) NOT NULL,
	`create_by` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `bot_telegram` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`token` varchar(128) NOT NULL,
	`username_bot` varchar(128) NOT NULL,
	`username_owner` varchar(128) NOT NULL,
	`id_telegram_owner` varchar(128) NOT NULL,
	`id_group_teknisi` varchar(50) NOT NULL,
	`create_by` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `cat_expenditure` (
	`category_id` int(11) AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`remark` text NOT NULL,
	`create_by` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `cat_income` (
	`category_id` int(11) AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`remark` text NOT NULL,
	`create_by` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `company` (
	`id` int(11) NOT NULL,
	`company_name` varchar(100) NOT NULL,
	`sub_name` varchar(128) NOT NULL,
	`description` text NOT NULL,
	`picture` text NOT NULL,
	`logo` text NOT NULL,
	`whatsapp` varchar(100) NOT NULL,
	`facebook` varchar(100) NOT NULL,
	`twitter` varchar(100) NOT NULL,
	`instagram` varchar(100) NOT NULL,
	`phone` varchar(100) NOT NULL,
	`email` varchar(100) NOT NULL,
	`owner` varchar(128) NOT NULL,
	`video` text NOT NULL,
	`address` text NOT NULL,
	`due_date` int(11) NOT NULL,
	`ppn` int(11) NOT NULL,
	`admin_fee` int(11) NOT NULL,
	`terms` text NOT NULL,
	`policy` text NOT NULL,
	`expired` varchar(50) NOT NULL,
	`isolir` int(11) NOT NULL,
	`import` int(11) NOT NULL,
	`apps_name` varchar(20) NOT NULL,
	`cek_bill` int(11) NOT NULL,
	`cek_usage` int(11) NOT NULL,
	`latitude` text NOT NULL,
	`longitude` text NOT NULL,
	`phonecode` int(11) NOT NULL,
	`country` int(11) NOT NULL,
	`currency` varchar(50) NOT NULL,
	`timezone` varchar(50) NOT NULL,
	`tawk` text NOT NULL,
	`speedtest` text NOT NULL,
	`maintenance` int(11) NOT NULL,
	`watermark` int(11) NOT NULL,
	`version` text NOT NULL,
	`last_update` text NOT NULL,
	`bcava` text NOT NULL,
	`licence` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `confirm_payment` (
	`confirm_id` int(11) AUTO_INCREMENT NOT NULL,
	`invoice_id` int(11) NOT NULL,
	`no_services` varchar(25) NOT NULL,
	`metode_payment` varchar(50) NOT NULL,
	`date_payment` varchar(50) NOT NULL,
	`status` varchar(20) NOT NULL,
	`remark` text NOT NULL,
	`date_created` int(11) NOT NULL,
	`picture` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `country` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`iso` char(2) NOT NULL,
	`name` varchar(80) NOT NULL,
	`nicename` varchar(80) NOT NULL,
	`iso3` char(3) DEFAULT 'NULL',
	`numcode` smallint(6) DEFAULT 'NULL',
	`phonecode` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `coupon` (
	`coupon_id` int(11) AUTO_INCREMENT NOT NULL,
	`code` varchar(20) NOT NULL,
	`is_active` int(11) NOT NULL,
	`percent` int(11) NOT NULL,
	`one_time` int(11) NOT NULL,
	`max_active` int(11) NOT NULL,
	`max_limit` int(11) NOT NULL,
	`created` int(11) NOT NULL,
	`expired` varchar(50) NOT NULL,
	`remark` text NOT NULL,
	`create_by` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `coverage` (
	`coverage_id` int(11) AUTO_INCREMENT NOT NULL,
	`c_name` varchar(128) NOT NULL,
	`address` text NOT NULL,
	`id_prov` varchar(50) NOT NULL,
	`id_kab` varchar(50) NOT NULL,
	`id_kec` varchar(50) NOT NULL,
	`id_kel` varchar(50) NOT NULL,
	`comment` text NOT NULL,
	`latitude` text NOT NULL,
	`longitude` text NOT NULL,
	`radius` int(11) NOT NULL,
	`public` int(11) NOT NULL,
	`code_area` int(11) NOT NULL,
	`create_by` int(11) NOT NULL,
	`coverage_mitra` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `cover_operator` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`role_id` int(11) NOT NULL,
	`coverage_id` int(11) NOT NULL,
	`operator` int(11) NOT NULL,
	`create_by` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `cover_package` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`coverage_id` int(11) NOT NULL,
	`package_id` int(11) NOT NULL,
	`created` int(11) NOT NULL,
	`create_by` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `currencies` (
	`code` varchar(15) NOT NULL,
	`name` varchar(100) NOT NULL,
	`number` char(5) NOT NULL,
	`subunits_in_unit` int(11) NOT NULL,
	`countries` longtext NOT NULL
);
--> statement-breakpoint
CREATE TABLE `customer` (
	`customer_id` int(11) AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`no_services` varchar(128) NOT NULL,
	`email` varchar(128) NOT NULL,
	`register_date` varchar(50) NOT NULL,
	`due_date` int(11) NOT NULL,
	`address` text NOT NULL,
	`no_wa` varchar(128) NOT NULL,
	`c_status` varchar(128) NOT NULL,
	`ppn` int(11) NOT NULL,
	`no_ktp` varchar(128) NOT NULL,
	`ktp` text NOT NULL,
	`created` int(11) NOT NULL,
	`mode_user` varchar(50) NOT NULL,
	`user_mikrotik` varchar(128) NOT NULL,
	`mitra` int(11) NOT NULL,
	`coverage` int(11) NOT NULL,
	`auto_isolir` int(11) NOT NULL,
	`type_id` varchar(50) NOT NULL,
	`router` int(11) NOT NULL,
	`codeunique` int(11) NOT NULL,
	`phonecode` int(11) NOT NULL,
	`latitude` text NOT NULL,
	`longitude` text NOT NULL,
	`user_profile` varchar(50) NOT NULL,
	`action` int(11) NOT NULL,
	`type_payment` int(11) NOT NULL,
	`max_due_isolir` int(11) NOT NULL,
	`olt` int(11) NOT NULL,
	`connection` int(11) NOT NULL,
	`cust_amount` int(11) NOT NULL,
	`mac_address` varchar(50) NOT NULL,
	`level` int(11) NOT NULL,
	`cust_description` text NOT NULL,
	`type_ip` int(11) NOT NULL,
	`id_odc` int(11) NOT NULL,
	`id_odp` int(11) NOT NULL,
	`no_port_odp` int(11) NOT NULL,
	`month_due_date` int(11) NOT NULL,
	`send_bill` int(11) NOT NULL,
	`serial_number` text NOT NULL,
	`pass_mikrotik` text NOT NULL,
	`slot` int(11) NOT NULL,
	`port` int(11) NOT NULL,
	`onu_index` int(11) NOT NULL,
	`onu_type` text NOT NULL,
	`vlan` int(11) NOT NULL,
	`no_va` text NOT NULL,
	`up_onu` text NOT NULL,
	`down_onu` text NOT NULL,
	`customer_mitra` int(11) NOT NULL,
	`createby` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `customer_chart` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`id_chart` varchar(50) NOT NULL,
	`fromcs` varchar(50) NOT NULL,
	`tocs` varchar(128) NOT NULL,
	`type` varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `customer_line` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`id_line` varchar(50) NOT NULL,
	`customer_id` varchar(50) NOT NULL,
	`width` int(11) NOT NULL,
	`height` int(11) NOT NULL,
	`dir` varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `customer_status` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`status` text NOT NULL,
	`remark` text NOT NULL,
	`active_bill` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `customer_usage` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`no_services` varchar(50) NOT NULL,
	`count_usage` varchar(100) NOT NULL,
	`date_usage` varchar(50) NOT NULL,
	`last_update` varchar(40) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `email` (
	`id` int(11) NOT NULL,
	`protocol` varchar(50) NOT NULL,
	`host` varchar(50) NOT NULL,
	`email` varchar(50) NOT NULL,
	`password` varchar(50) NOT NULL,
	`port` varchar(50) NOT NULL,
	`name` varchar(50) NOT NULL,
	`send_payment` int(11) NOT NULL,
	`send_verify` int(11) NOT NULL,
	`forgot_password` int(11) NOT NULL,
	`text_create` text NOT NULL,
	`text_pay` text NOT NULL,
	`text_verify` text NOT NULL,
	`text_forgot` text NOT NULL,
	`create_invoice` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `expenditure` (
	`expenditure_id` int(11) AUTO_INCREMENT NOT NULL,
	`date_payment` varchar(125) NOT NULL,
	`nominal` varchar(125) NOT NULL,
	`remark` text NOT NULL,
	`created` int(11) NOT NULL,
	`category` int(11) NOT NULL,
	`create_by` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `help` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`no_ticket` varchar(50) NOT NULL,
	`help_type` int(11) NOT NULL,
	`help_solution` int(11) NOT NULL,
	`no_services` varchar(50) NOT NULL,
	`description` text NOT NULL,
	`date_created` int(11) NOT NULL,
	`status` varchar(50) NOT NULL,
	`teknisi` int(11) NOT NULL,
	`picture` text NOT NULL,
	`create_by` int(11) NOT NULL,
	`action` int(11) NOT NULL,
	`estimation` int(11) NOT NULL,
	`ticket_password` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `help_action` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`action` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `help_solution` (
	`hs_id` int(11) AUTO_INCREMENT NOT NULL,
	`hs_help_id` int(11) NOT NULL,
	`hs_name` varchar(110) NOT NULL,
	`solution` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `help_timeline` (
	`ht_id` int(11) AUTO_INCREMENT NOT NULL,
	`help_id` int(11) NOT NULL,
	`date_update` int(11) NOT NULL,
	`remark` text NOT NULL,
	`teknisi` int(11) NOT NULL,
	`status` varchar(50) NOT NULL,
	`date_created` varchar(40) NOT NULL,
	`action` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `help_type` (
	`help_id` int(11) AUTO_INCREMENT NOT NULL,
	`help_type` varchar(50) NOT NULL,
	`help_remark` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `income` (
	`income_id` int(11) AUTO_INCREMENT NOT NULL,
	`date_payment` varchar(125) NOT NULL,
	`nominal` varchar(125) NOT NULL,
	`remark` text NOT NULL,
	`created` int(11) NOT NULL,
	`category` int(11) NOT NULL,
	`create_by` int(11) NOT NULL,
	`invoice_id` int(11) NOT NULL,
	`no_services` varchar(50) NOT NULL,
	`mode_payment` varchar(50) NOT NULL,
	`picture` text NOT NULL,
	`coverage` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `invoice` (
	`invoice_id` int(11) AUTO_INCREMENT NOT NULL,
	`invoice` varchar(128) NOT NULL,
	`code_unique` int(11) NOT NULL,
	`month` varchar(11) NOT NULL,
	`year` int(11) NOT NULL,
	`no_services` varchar(128) NOT NULL,
	`status` varchar(128) NOT NULL,
	`i_ppn` int(11) NOT NULL,
	`created` int(11) NOT NULL,
	`create_by` int(11) NOT NULL,
	`date_payment` int(11) DEFAULT 'NULL',
	`metode_payment` varchar(100) NOT NULL,
	`admin_fee` int(11) NOT NULL,
	`amount` int(11) NOT NULL,
	`order_id` varchar(128) NOT NULL,
	`token` text NOT NULL,
	`payment_type` varchar(128) NOT NULL,
	`transaction_time` varchar(50) NOT NULL,
	`bank` varchar(50) NOT NULL,
	`va_number` varchar(50) NOT NULL,
	`pdf_url` text NOT NULL,
	`status_code` varchar(5) NOT NULL,
	`expired` text NOT NULL,
	`x_id` varchar(128) NOT NULL,
	`x_bank_code` varchar(128) NOT NULL,
	`x_method` varchar(50) NOT NULL,
	`x_account_number` varchar(50) NOT NULL,
	`x_expired` varchar(50) NOT NULL,
	`x_external_id` varchar(50) NOT NULL,
	`x_amount` varchar(50) NOT NULL,
	`x_qrcode` text NOT NULL,
	`reference` text NOT NULL,
	`payment_url` text NOT NULL,
	`code_coupon` varchar(50) NOT NULL,
	`disc_coupon` int(11) NOT NULL,
	`outlet` int(11) NOT NULL,
	`status_income` varchar(40) NOT NULL,
	`inv_due_date` varchar(40) NOT NULL,
	`date_isolir` varchar(50) NOT NULL,
	`send_before_due` varchar(50) NOT NULL,
	`send_due` varchar(50) NOT NULL,
	`picture` text NOT NULL,
	`inv_ppn` int(11) NOT NULL,
	`picture1` text NOT NULL,
	`send_bill` varchar(50) NOT NULL,
	`send_paid` varchar(50) NOT NULL,
	`date_paid` varchar(50) NOT NULL,
	`send_bill_email` text NOT NULL,
	`send_bill_sms` text NOT NULL,
	`send_paid_email` text NOT NULL,
	`send_paid_sms` text NOT NULL,
	`subtotal` int(11) NOT NULL,
	`amountuniq` int(11) NOT NULL,
	`daterequniq` int(11) NOT NULL,
	CONSTRAINT `invoice` UNIQUE(`invoice`)
);
--> statement-breakpoint
CREATE TABLE `invoice_detail` (
	`detail_id` int(11) AUTO_INCREMENT NOT NULL,
	`invoice_id` varchar(128) NOT NULL,
	`price` varchar(125) NOT NULL,
	`qty` varchar(125) NOT NULL,
	`disc` varchar(128) NOT NULL,
	`remark` text NOT NULL,
	`total` varchar(128) NOT NULL,
	`item_id` int(11) NOT NULL,
	`category_id` int(11) NOT NULL,
	`d_month` int(11) NOT NULL,
	`d_year` int(11) NOT NULL,
	`d_no_services` varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `logs` (
	`log_id` int(11) AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`datetime` int(11) NOT NULL,
	`date_log` varchar(40) NOT NULL,
	`category` varchar(128) NOT NULL,
	`role_id` int(11) NOT NULL,
	`user_id` int(11) NOT NULL,
	`remark` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `maps` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`vendor` text NOT NULL,
	`token` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `modem` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`type` int(11) NOT NULL,
	`name` varchar(50) NOT NULL,
	`customer_id` int(11) NOT NULL,
	`show_customer` int(11) NOT NULL,
	`ip_local` text NOT NULL,
	`ip_public` text NOT NULL,
	`ssid_name` varchar(50) NOT NULL,
	`ssid_password` varchar(50) NOT NULL,
	`login_user` varchar(50) NOT NULL,
	`login_password` varchar(50) NOT NULL,
	`remark` text NOT NULL,
	`created` int(11) NOT NULL,
	`createby` int(11) NOT NULL,
	`updated` int(11) NOT NULL,
	`updateby` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `moota` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`is_active` int(11) NOT NULL,
	`token` text NOT NULL,
	`send_whatsapp` text NOT NULL,
	`send_telegram` text NOT NULL,
	`secret` text NOT NULL,
	`no_whatsapp` text NOT NULL,
	`text_income` text NOT NULL,
	`text_expend` text NOT NULL,
	`change_bill` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `m_brand_device` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`onu_type` int(11) NOT NULL,
	`name` text NOT NULL,
	`remark` text NOT NULL,
	`created` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `m_odc` (
	`id_odc` int(11) AUTO_INCREMENT NOT NULL,
	`code_odc` text NOT NULL,
	`coverage_odc` int(11) NOT NULL,
	`no_port_olt` int(11) NOT NULL,
	`color_tube_fo` text NOT NULL,
	`no_pole` text NOT NULL,
	`latitude` text NOT NULL,
	`longitude` text NOT NULL,
	`total_port` int(11) NOT NULL,
	`document` text NOT NULL,
	`remark` text NOT NULL,
	`created` int(11) NOT NULL,
	`create_by` int(11) NOT NULL,
	`role_id` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `m_odp` (
	`id_odp` int(11) AUTO_INCREMENT NOT NULL,
	`code_odp` text NOT NULL,
	`code_odc` int(11) NOT NULL,
	`coverage_odp` int(11) NOT NULL,
	`no_port_odc` int(11) NOT NULL,
	`color_tube_fo` text NOT NULL,
	`no_pole` text NOT NULL,
	`latitude` text NOT NULL,
	`longitude` text NOT NULL,
	`total_port` int(11) NOT NULL,
	`document` text NOT NULL,
	`remark` text NOT NULL,
	`created` int(11) NOT NULL,
	`create_by` int(11) NOT NULL,
	`role_id` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `olt` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`is_active` int(11) NOT NULL,
	`ip_address` text NOT NULL,
	`alias` varchar(40) NOT NULL,
	`vendor` varchar(50) NOT NULL,
	`username` varchar(50) NOT NULL,
	`password` varchar(50) NOT NULL,
	`value` varchar(40) NOT NULL,
	`token` text NOT NULL,
	`bridge_olt` text NOT NULL,
	`port` int(11) NOT NULL,
	`type` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `other` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`say_wa` text NOT NULL,
	`body_wa` text NOT NULL,
	`footer_wa` text NOT NULL,
	`thanks_wa` text NOT NULL,
	`add_customer` text NOT NULL,
	`code_unique` int(11) NOT NULL,
	`text_code_unique` text NOT NULL,
	`remark_invoice` text NOT NULL,
	`date_reset` int(11) NOT NULL,
	`date_create` int(11) NOT NULL,
	`date_reminder` int(11) NOT NULL,
	`key_apps` varchar(50) NOT NULL,
	`reset_password` text NOT NULL,
	`code_otp` text NOT NULL,
	`sch_isolir` int(11) NOT NULL,
	`sch_createbill` int(11) NOT NULL,
	`sch_usage` int(11) NOT NULL,
	`sch_reset_usage` int(11) NOT NULL,
	`sch_before_due` int(11) NOT NULL,
	`sch_due` int(11) NOT NULL,
	`sch_resend` int(11) NOT NULL,
	`inv_thermal` int(11) NOT NULL,
	`checkout` text NOT NULL,
	`create_help` text NOT NULL,
	`create_help_customer` text NOT NULL,
	`frontend` int(11) NOT NULL,
	`showentri` int(11) NOT NULL,
	`sch_backup` int(11) NOT NULL,
	`size_thermal` int(11) NOT NULL,
	`text_help_customer` text NOT NULL,
	`versi_menu` int(11) NOT NULL,
	`default_lang` text NOT NULL,
	`last_ex_generate` text NOT NULL,
	`last_ex_isolir` text NOT NULL,
	`last_ex_usage` text NOT NULL,
	`last_ex_backup` text NOT NULL,
	`text_isolir` text NOT NULL,
	`sch_router` text NOT NULL,
	`package` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `package` (
	`id` int(11) NOT NULL,
	`payment_gateway` int(11) NOT NULL,
	`router` int(11) NOT NULL,
	`count_router` int(11) NOT NULL,
	`count_customer` int(11) NOT NULL,
	`telegram_bot` int(11) NOT NULL,
	`wa_gateway` int(11) NOT NULL,
	`maps` int(11) NOT NULL,
	`chart` int(11) NOT NULL,
	`mitra` int(11) NOT NULL,
	`invoice_custom` int(11) NOT NULL,
	`invoice_no` int(11) NOT NULL,
	`coverage_operator` int(11) NOT NULL,
	`coverage_teknisi` int(11) NOT NULL,
	`modem` int(11) NOT NULL,
	`coverage_package` int(11) NOT NULL,
	`olt` int(11) NOT NULL,
	`count_olt` int(11) NOT NULL,
	`absensi` int(11) NOT NULL,
	`briva` int(11) NOT NULL,
	`sms_gateway` int(11) NOT NULL,
	`moota` int(11) NOT NULL,
	`bcava` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `package_category` (
	`p_category_id` int(11) AUTO_INCREMENT NOT NULL,
	`name` varchar(125) NOT NULL,
	`description` text NOT NULL,
	`date_created` int(11) NOT NULL,
	`date_updated` int(11) NOT NULL,
	`create_by` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `package_item` (
	`p_item_id` int(11) AUTO_INCREMENT NOT NULL,
	`name` varchar(125) NOT NULL,
	`price` varchar(125) NOT NULL,
	`picture` text NOT NULL,
	`description` text NOT NULL,
	`category_id` int(11) NOT NULL,
	`date_created` int(11) NOT NULL,
	`date_update` int(11) NOT NULL,
	`public` int(11) NOT NULL,
	`is_active` int(11) NOT NULL,
	`create_by` int(11) NOT NULL,
	`role_id` int(11) NOT NULL,
	`package_mitra` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `payment_gateway` (
	`id` int(11) NOT NULL,
	`vendor` varchar(50) NOT NULL,
	`api_key` text NOT NULL,
	`server_key` text NOT NULL,
	`client_key` text NOT NULL,
	`is_active` int(11) NOT NULL,
	`mode` int(11) NOT NULL,
	`expired` int(11) NOT NULL,
	`bca_va` int(11) NOT NULL,
	`bri_va` int(11) NOT NULL,
	`bni_va` int(11) NOT NULL,
	`kodemerchant` text NOT NULL,
	`mandiri_va` int(11) NOT NULL,
	`cimb_va` int(11) NOT NULL,
	`mybank_va` int(11) NOT NULL,
	`ovo` int(11) NOT NULL,
	`permata_va` int(11) NOT NULL,
	`gopay` int(11) NOT NULL,
	`shopeepay` int(11) NOT NULL,
	`indomaret` int(11) NOT NULL,
	`alfamart` int(11) NOT NULL,
	`admin_fee` int(11) NOT NULL,
	`va` int(11) NOT NULL,
	`ewallet` int(11) NOT NULL,
	`retail` int(11) NOT NULL,
	`qrcode` int(11) NOT NULL,
	`alfamidi` int(11) NOT NULL,
	`muamalat_va` int(11) NOT NULL,
	`sinarmas_va` int(11) NOT NULL,
	`dana` int(11) NOT NULL,
	`linkaja` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `payment_gateway_transaction` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`vendor` text NOT NULL,
	`external_id` text NOT NULL,
	`method` text NOT NULL,
	`code_number` text NOT NULL,
	`customer_id` text NOT NULL,
	`no_services` text NOT NULL,
	`invoice` text NOT NULL,
	`reference` text NOT NULL,
	`payment_url` text NOT NULL,
	`transaction_time` text NOT NULL,
	`date_created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `product` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`name` varchar(225) NOT NULL,
	`picture` text NOT NULL,
	`remark` text NOT NULL,
	`link` text NOT NULL,
	`description` text NOT NULL,
	`date_created` int(11) NOT NULL,
	`create_by` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `promo` (
	`promo_id` int(11) AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`picture` text NOT NULL,
	`remark` text NOT NULL,
	`slug` text NOT NULL,
	`description` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `report_transaction` (
	`report_id` int(11) AUTO_INCREMENT NOT NULL,
	`date` varchar(128) NOT NULL,
	`income` varchar(128) NOT NULL,
	`expenditure` varchar(128) NOT NULL,
	`remark` text NOT NULL,
	`created` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `role_group` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`role_id` int(11) NOT NULL,
	`role_name` text NOT NULL,
	`remark` text NOT NULL,
	`profit_sharing` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `role_management` (
	`role_id` int(11) AUTO_INCREMENT NOT NULL,
	`show_customer` int(11) NOT NULL,
	`add_customer` int(11) NOT NULL,
	`edit_customer` int(11) NOT NULL,
	`del_customer` int(11) NOT NULL,
	`show_item` int(11) NOT NULL,
	`add_item` int(11) NOT NULL,
	`edit_item` int(11) NOT NULL,
	`del_item` int(11) NOT NULL,
	`show_bill` int(11) NOT NULL,
	`add_bill` int(11) NOT NULL,
	`del_bill` int(11) NOT NULL,
	`show_coverage` int(11) NOT NULL,
	`add_coverage` int(11) NOT NULL,
	`edit_coverage` int(11) NOT NULL,
	`del_coverage` int(11) NOT NULL,
	`coverage_operator` int(11) NOT NULL,
	`show_slide` int(11) NOT NULL,
	`add_slide` int(11) NOT NULL,
	`edit_slide` int(11) NOT NULL,
	`del_slide` int(11) NOT NULL,
	`show_router` int(11) NOT NULL,
	`add_router` int(11) NOT NULL,
	`edit_router` int(11) NOT NULL,
	`del_router` int(11) NOT NULL,
	`show_saldo` int(11) NOT NULL,
	`show_income` int(11) NOT NULL,
	`add_income` int(11) NOT NULL,
	`edit_income` int(11) NOT NULL,
	`del_income` int(11) NOT NULL,
	`show_user` int(11) NOT NULL,
	`edit_user` int(11) NOT NULL,
	`del_user` int(11) NOT NULL,
	`add_user` int(11) NOT NULL,
	`show_product` int(11) NOT NULL,
	`add_product` int(11) NOT NULL,
	`edit_product` int(11) NOT NULL,
	`del_product` int(11) NOT NULL,
	`show_usage` int(11) NOT NULL,
	`show_history` int(11) NOT NULL,
	`show_speedtest` int(11) NOT NULL,
	`show_log` int(11) NOT NULL,
	`cek_bill` int(11) NOT NULL,
	`cek_usage` int(11) NOT NULL,
	`show_help` int(11) NOT NULL,
	`edit_help` int(11) NOT NULL,
	`del_help` int(11) NOT NULL,
	`add_help` int(11) NOT NULL,
	`register_coverage` int(11) NOT NULL,
	`register_maps` int(11) NOT NULL,
	`register_show` int(11) NOT NULL,
	`coverage_teknisi` int(11) NOT NULL,
	`customer_free` int(11) NOT NULL,
	`customer_isolir` int(11) NOT NULL,
	`edit_bill` int(11) NOT NULL,
	`confirm_bill` int(11) NOT NULL,
	`add_odc` int(11) NOT NULL,
	`edit_odc` int(11) NOT NULL,
	`del_odc` int(11) NOT NULL,
	`add_odp` int(11) NOT NULL,
	`edit_odp` int(11) NOT NULL,
	`del_odp` int(11) NOT NULL,
	`add_midi` int(11) NOT NULL,
	`edit_midi` int(11) NOT NULL,
	`del_midi` int(11) NOT NULL,
	`add_voip` int(11) NOT NULL,
	`edit_voip` int(11) NOT NULL,
	`del_voip` int(11) NOT NULL,
	`add_gsm` int(11) NOT NULL,
	`edit_gsm` int(11) NOT NULL,
	`del_gsm` int(11) NOT NULL,
	`add_item_inventori` int(11) NOT NULL,
	`edit_item_inventori` int(11) NOT NULL,
	`del_item_inventori` int(11) NOT NULL,
	`add_vendor` int(11) NOT NULL,
	`edit_vendor` int(11) NOT NULL,
	`del_vendor` int(11) NOT NULL,
	`pay_bill` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `role_menu` (
	`role_id` int(11) NOT NULL,
	`customer` int(11) NOT NULL,
	`customer_menu` int(11) NOT NULL,
	`customer_add` int(11) NOT NULL,
	`customer_active` int(11) NOT NULL,
	`customer_non_active` int(11) NOT NULL,
	`customer_waiting` int(11) NOT NULL,
	`customer_whatsapp` int(11) NOT NULL,
	`customer_chart` int(11) NOT NULL,
	`customer_maps` int(11) NOT NULL,
	`services_menu` int(11) NOT NULL,
	`services_add` int(11) NOT NULL,
	`services_item` int(11) NOT NULL,
	`services_category` int(11) NOT NULL,
	`coverage` int(11) NOT NULL,
	`coverage_add` int(11) NOT NULL,
	`coverage_menu` int(11) NOT NULL,
	`coverage_maps` int(11) NOT NULL,
	`bill` int(11) NOT NULL,
	`bill_menu` int(11) NOT NULL,
	`bill_unpaid` int(11) NOT NULL,
	`bill_paid` int(11) NOT NULL,
	`bill_due_date` int(11) NOT NULL,
	`bill_draf` int(11) NOT NULL,
	`bill_debt` int(11) NOT NULL,
	`bill_confirm` int(11) NOT NULL,
	`bill_code_coupon` int(11) NOT NULL,
	`bill_history` int(11) NOT NULL,
	`bill_delete` int(11) NOT NULL,
	`bill_send` int(11) NOT NULL,
	`finance_menu` int(11) NOT NULL,
	`finance_income` int(11) NOT NULL,
	`finance_expend` int(11) NOT NULL,
	`finance_report` int(11) NOT NULL,
	`help` int(11) NOT NULL,
	`help_menu` int(11) NOT NULL,
	`help_category` int(11) NOT NULL,
	`router` int(11) NOT NULL,
	`router_menu` int(11) NOT NULL,
	`router_customer` int(11) NOT NULL,
	`router_schedule` int(11) NOT NULL,
	`website_menu` int(11) NOT NULL,
	`website_slide` int(11) NOT NULL,
	`website_product` int(11) NOT NULL,
	`user` int(11) NOT NULL,
	`user_menu` int(11) NOT NULL,
	`user_add` int(11) NOT NULL,
	`user_admin` int(11) NOT NULL,
	`user_operator` int(11) NOT NULL,
	`user_teknisi` int(11) NOT NULL,
	`user_mitra` int(11) NOT NULL,
	`user_outlet` int(11) NOT NULL,
	`user_customer` int(11) NOT NULL,
	`user_kolektor` int(11) NOT NULL,
	`user_finance` int(11) NOT NULL,
	`role_menu` int(11) NOT NULL,
	`role_access` int(11) NOT NULL,
	`role_sub_menu` int(11) NOT NULL,
	`integration_menu` int(11) NOT NULL,
	`integration_whatsapp` int(11) NOT NULL,
	`integration_email` int(11) NOT NULL,
	`integration_telegram` int(11) NOT NULL,
	`integration_sms` int(11) NOT NULL,
	`integration_payment_gateway` int(11) NOT NULL,
	`integration_olt` int(11) NOT NULL,
	`integration_radius` int(11) NOT NULL,
	`setting_menu` int(11) NOT NULL,
	`setting_company` int(11) NOT NULL,
	`setting_about_company` int(11) NOT NULL,
	`setting_bank_account` int(11) NOT NULL,
	`setting_terms_condition` int(11) NOT NULL,
	`setting_privacy_policy` int(11) NOT NULL,
	`setting_logs` int(11) NOT NULL,
	`setting_backup` int(11) NOT NULL,
	`setting_other` int(11) NOT NULL,
	`customer_free` int(11) NOT NULL,
	`customer_isolir` int(11) NOT NULL,
	`integration_briva` int(11) NOT NULL,
	`integration_moota` int(11) NOT NULL,
	`master_menu` int(11) NOT NULL,
	`master_odc` int(11) NOT NULL,
	`master_odp` int(11) NOT NULL,
	`role_group` int(11) NOT NULL,
	`maps_menu` int(11) NOT NULL,
	`maps_customer` int(11) NOT NULL,
	`maps_coverage` int(11) NOT NULL,
	`maps_odc` int(11) NOT NULL,
	`maps_odp` int(11) NOT NULL,
	`master_statuscustomer` int(11) NOT NULL,
	`master_branddevice` int(11) NOT NULL,
	`master_script` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `router` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`is_active` int(11) NOT NULL,
	`alias` varchar(50) NOT NULL,
	`ip_address` text NOT NULL,
	`username` varchar(20) NOT NULL,
	`password` varchar(100) NOT NULL,
	`port` int(11) NOT NULL,
	`date_reset` int(11) NOT NULL,
	`create_by` int(11) NOT NULL,
	`router_mitra` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `script` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`vendor` text NOT NULL,
	`onu_type` text NOT NULL,
	`script` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `services` (
	`services_id` int(11) AUTO_INCREMENT NOT NULL,
	`email` varchar(50) NOT NULL,
	`item_id` int(11) NOT NULL,
	`category_id` int(11) NOT NULL,
	`no_services` varchar(125) NOT NULL,
	`qty` varchar(128) NOT NULL,
	`price` varchar(128) NOT NULL,
	`disc` varchar(128) DEFAULT 'NULL',
	`total` varchar(128) NOT NULL,
	`remark` text NOT NULL,
	`services_create` int(11) NOT NULL,
	`create_by` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `slide` (
	`slide_id` int(11) AUTO_INCREMENT NOT NULL,
	`name` varchar(225) NOT NULL,
	`picture` text NOT NULL,
	`description` text NOT NULL,
	`link` text NOT NULL,
	`create_by` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sms_gateway` (
	`sms_id` int(11) AUTO_INCREMENT NOT NULL,
	`sms_name` text NOT NULL,
	`sms_url` text NOT NULL,
	`sms_token` text NOT NULL,
	`sms_user` text NOT NULL,
	`sms_password` text NOT NULL,
	`sms_api_key` text NOT NULL,
	`is_active` int(11) NOT NULL,
	`sms_vendor` text NOT NULL,
	`sms_createinvoice` int(11) NOT NULL,
	`sms_paymentinvoice` int(11) NOT NULL,
	`sms_duedateinvoice` int(11) NOT NULL,
	`sms_interval` int(11) NOT NULL,
	`sms_reminderinvoice` int(11) NOT NULL,
	`sms_sender` text NOT NULL,
	`sms_time_start` text NOT NULL,
	`sms_time_end` text NOT NULL,
	`text_bill` text NOT NULL,
	`text_payment` text NOT NULL,
	`text_duedate` text NOT NULL,
	`text_add_customer` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `theme` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`user_id` int(11) NOT NULL,
	`dark_mode` int(11) NOT NULL,
	`nav_active` text NOT NULL,
	`primary-color` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `timezone` (
	`timezid` int(11) AUTO_INCREMENT NOT NULL,
	`tz` varchar(255) NOT NULL,
	`gmt` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`email` varchar(128) NOT NULL,
	`password` varchar(100) NOT NULL,
	`name` varchar(128) NOT NULL,
	`phone` varchar(25) NOT NULL,
	`address` text NOT NULL,
	`image` varchar(225) NOT NULL,
	`role_id` text NOT NULL,
	`is_active` int(11) NOT NULL,
	`date_created` int(11) NOT NULL,
	`gender` varchar(10) NOT NULL,
	`no_services` varchar(50) NOT NULL,
	`fee` int(11) NOT NULL,
	`ppn` varchar(40) NOT NULL,
	`pph` varchar(40) NOT NULL,
	`bhp` varchar(40) NOT NULL,
	`uso` varchar(40) NOT NULL,
	`admin` varchar(40) NOT NULL,
	`fee_active` varchar(40) NOT NULL,
	`fee_mitra` varchar(50) NOT NULL,
	`lang` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_token` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`type` int(11) NOT NULL,
	`email` varchar(128) NOT NULL,
	`token` varchar(128) NOT NULL,
	`date_created` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `whatsapp` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`is_active` int(11) NOT NULL,
	`api_key` text NOT NULL,
	`token` text NOT NULL,
	`domain_api` text NOT NULL,
	`username` varchar(50) NOT NULL,
	`vendor` varchar(128) NOT NULL,
	`createinvoice` int(11) NOT NULL,
	`paymentinvoice` int(11) NOT NULL,
	`duedateinvoice` int(11) NOT NULL,
	`interval_message` int(11) NOT NULL,
	`sender` varchar(128) NOT NULL,
	`reminderinvoice` int(11) NOT NULL,
	`version` int(11) NOT NULL,
	`period` int(11) NOT NULL,
	`create_help` text NOT NULL,
	`update_help` text NOT NULL,
	`get_help` text NOT NULL,
	`create_help_customer` int(11) NOT NULL,
	`create_help_admin` int(11) NOT NULL,
	`id_devices` int(11) NOT NULL,
	`text_help_customer` int(11) NOT NULL,
	`send_help_customer` int(11) NOT NULL,
	`official` int(11) NOT NULL,
	`count_blast` int(11) NOT NULL,
	`last_excute` text NOT NULL,
	`time_start` text NOT NULL,
	`time_end` text NOT NULL,
	`send_isolir` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `whatsapp_schedule` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`target` text NOT NULL,
	`message` text NOT NULL,
	`customer_id` int(11) NOT NULL,
	`invoice_id` text NOT NULL,
	`date_excute` text NOT NULL,
	`type_message` text NOT NULL,
	`create_by` int(11) NOT NULL,
	`created` int(11) NOT NULL,
	`remark` text NOT NULL,
	`status` text NOT NULL,
	`type_bill` text NOT NULL,
	`date_created` text NOT NULL,
	`vendor` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `invoice_id` ON `invoice_detail` (`invoice_id`);--> statement-breakpoint
CREATE INDEX `category_id` ON `invoice_detail` (`category_id`);--> statement-breakpoint
CREATE INDEX `item_id` ON `invoice_detail` (`item_id`);--> statement-breakpoint
CREATE INDEX `category_id` ON `package_item` (`category_id`);--> statement-breakpoint
CREATE INDEX `item_id` ON `services` (`item_id`);--> statement-breakpoint
CREATE INDEX `category_id` ON `services` (`category_id`);
*/