-- This trivial script creates a default user for the
-- database used by the DMaaP Bus Controller application
-- and the DMaaP Bus Controller microservice. 
create user 'dbcauser'@'localhost' identified by 'dbca1234';
grant all on dbca.* to dbcauser@localhost;
