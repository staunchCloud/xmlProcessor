ECHO OFF

REM SET JAVA_HOME=D:\SDK\jdk6_x64

SET HOME=.
SET JAVA_OPTS=-server -Xms64m -Xmx1024m -XX:+UseParallelGC
SET MAIN_CLASS=pers.cloud.xmlProcessor.main.Server

IF "%1" == "" ( 
	SET MAIN_OPTS=-conf ../conf/config.xml 
) ELSE ( 
	SET MAIN_OPTS=-conf %1 
) 

SET LIB_OPTS=%HOME%/lib/*;%HOME%/classes;%HOME%/*;%HOME%/conf;
IF NOT EXIST "%JAVA_HOME%" (
    SET JAVA=java
) ELSE (
    SET JAVA="%JAVA_HOME%\bin\java"
)
%JAVA% %JAVA_OPTS% -cp %LIB_OPTS% %MAIN_CLASS% %MAIN_OPTS% 