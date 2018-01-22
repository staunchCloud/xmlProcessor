#/usr/bin
#cat zbus.sh | col -b > zbus2.sh  ==> fix win=>lin
if [ -z ${JAVA_HOME} ]; then
JAVA_HOME=/apps/jdk
fi
HOME=./
JAVA_OPTS="-Dfile.encoding=UTF-8 -server -Xms64m -Xmx1024m -XX:+UseParallelGC"
MAIN_CLASS=pers.cloud.xmlProcessor.main.Server
if [ -z "$1" ]
  then
    MAIN_OPTS="-conf config.xml"
else
	MAIN_OPTS="-conf $1"
fi

LIB_OPTS="$HOME/lib/*:$HOME/classes:$HOME/*"
nohup $JAVA_HOME/bin/java $JAVA_OPTS -cp $LIB_OPTS $MAIN_CLASS $MAIN_OPTS &


