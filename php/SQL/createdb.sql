#Create User
#GRANT ALL PRIVILEGES ON *.* TO eccom@localhost IDENTIFIED BY 'eccom' WITH GRANT OPTION;
#GRANT ALL PRIVILEGES ON *.* TO eccom@"%" IDENTIFIED BY 'eccom' WITH GRANT OPTION;

DROP DATABASE IF EXISTS `todo`;

set character_set_database = 'gbk';
set character_set_server = 'gbk';
set names 'gbk';

CREATE DATABASE `todo`
    CHARACTER SET 'gbk'
    COLLATE 'gbk_chinese_ci';

COMMIT;