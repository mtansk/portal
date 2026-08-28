SET @root_password = LOAD_FILE('/var/lib/mysql-files/mysql_root_password');
SET @user_password = LOAD_FILE('/var/lib/mysql-files/mysql_user_password');

SET @root_password = TRIM(BOTH '\r\n' FROM @root_password);
SET @user_password = TRIM(BOTH '\r\n' FROM @user_password);

SET @create_user_query = CONCAT('CREATE USER \'user\'@\'localhost\' IDENTIFIED BY \'', @user_password, '\'');
PREPARE stmt FROM @create_user_query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

GRANT ALL PRIVILEGES ON *.* TO 'user'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;

SET @alter_root_query = CONCAT('ALTER USER \'root\'@\'%\' IDENTIFIED BY \'', @root_password, '\'');
PREPARE stmt FROM @alter_root_query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

RENAME USER 'root'@'%' TO 'root'@'localhost';
FLUSH PRIVILEGES;