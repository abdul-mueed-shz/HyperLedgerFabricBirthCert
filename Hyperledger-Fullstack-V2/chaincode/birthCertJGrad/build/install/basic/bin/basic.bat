@rem
@rem Copyright 2015 the original author or authors.
@rem
@rem Licensed under the Apache License, Version 2.0 (the "License");
@rem you may not use this file except in compliance with the License.
@rem You may obtain a copy of the License at
@rem
@rem      https://www.apache.org/licenses/LICENSE-2.0
@rem
@rem Unless required by applicable law or agreed to in writing, software
@rem distributed under the License is distributed on an "AS IS" BASIS,
@rem WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
@rem See the License for the specific language governing permissions and
@rem limitations under the License.
@rem

@if "%DEBUG%"=="" @echo off
@rem ##########################################################################
@rem
@rem  basic startup script for Windows
@rem
@rem ##########################################################################

@rem Set local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" setlocal

set DIRNAME=%~dp0
if "%DIRNAME%"=="" set DIRNAME=.
@rem This is normally unused
set APP_BASE_NAME=%~n0
set APP_HOME=%DIRNAME%..

@rem Resolve any "." and ".." in APP_HOME to make it shorter.
for %%i in ("%APP_HOME%") do set APP_HOME=%%~fi

@rem Add default JVM options here. You can also use JAVA_OPTS and BASIC_OPTS to pass JVM options to this script.
set DEFAULT_JVM_OPTS=

@rem Find java.exe
if defined JAVA_HOME goto findJavaFromJavaHome

set JAVA_EXE=java.exe
%JAVA_EXE% -version >NUL 2>&1
if %ERRORLEVEL% equ 0 goto execute

echo. 1>&2
echo ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH. 1>&2
echo. 1>&2
echo Please set the JAVA_HOME variable in your environment to match the 1>&2
echo location of your Java installation. 1>&2

goto fail

:findJavaFromJavaHome
set JAVA_HOME=%JAVA_HOME:"=%
set JAVA_EXE=%JAVA_HOME%/bin/java.exe

if exist "%JAVA_EXE%" goto execute

echo. 1>&2
echo ERROR: JAVA_HOME is set to an invalid directory: %JAVA_HOME% 1>&2
echo. 1>&2
echo Please set the JAVA_HOME variable in your environment to match the 1>&2
echo location of your Java installation. 1>&2

goto fail

:execute
@rem Setup the command line

set CLASSPATH=%APP_HOME%\lib\basic-1.0-SNAPSHOT.jar;%APP_HOME%\lib\fabric-chaincode-shim-2.5.5.jar;%APP_HOME%\lib\org.everit.json.schema-1.14.4.jar;%APP_HOME%\lib\json-20240303.jar;%APP_HOME%\lib\genson-1.5.jar;%APP_HOME%\lib\commons-cli-1.9.0.jar;%APP_HOME%\lib\commons-validator-1.7.jar;%APP_HOME%\lib\commons-logging-1.3.4.jar;%APP_HOME%\lib\fabric-protos-0.3.3.jar;%APP_HOME%\lib\bcpkix-jdk18on-1.79.jar;%APP_HOME%\lib\bcutil-jdk18on-1.79.jar;%APP_HOME%\lib\bcprov-jdk18on-1.79.jar;%APP_HOME%\lib\classgraph-4.8.179.jar;%APP_HOME%\lib\protobuf-java-util-3.25.5.jar;%APP_HOME%\lib\grpc-netty-shaded-1.68.1.jar;%APP_HOME%\lib\grpc-protobuf-1.68.1.jar;%APP_HOME%\lib\grpc-stub-1.68.1.jar;%APP_HOME%\lib\opentelemetry-grpc-1.6-2.8.0-alpha.jar;%APP_HOME%\lib\opentelemetry-extension-trace-propagators-1.42.1.jar;%APP_HOME%\lib\opentelemetry-sdk-extension-autoconfigure-1.42.1.jar;%APP_HOME%\lib\opentelemetry-exporter-otlp-1.42.1.jar;%APP_HOME%\lib\opentelemetry-exporter-otlp-common-1.42.1.jar;%APP_HOME%\lib\opentelemetry-exporter-sender-okhttp-1.42.1.jar;%APP_HOME%\lib\opentelemetry-exporter-common-1.42.1.jar;%APP_HOME%\lib\opentelemetry-sdk-extension-autoconfigure-spi-1.42.1.jar;%APP_HOME%\lib\opentelemetry-sdk-1.42.1.jar;%APP_HOME%\lib\opentelemetry-sdk-trace-1.42.1.jar;%APP_HOME%\lib\opentelemetry-instrumentation-api-incubator-2.8.0-alpha.jar;%APP_HOME%\lib\opentelemetry-instrumentation-api-2.8.0.jar;%APP_HOME%\lib\opentelemetry-sdk-metrics-1.42.1.jar;%APP_HOME%\lib\opentelemetry-sdk-logs-1.42.1.jar;%APP_HOME%\lib\opentelemetry-sdk-common-1.42.1.jar;%APP_HOME%\lib\opentelemetry-api-incubator-1.42.1-alpha.jar;%APP_HOME%\lib\opentelemetry-api-1.42.1.jar;%APP_HOME%\lib\opentelemetry-proto-1.3.2-alpha.jar;%APP_HOME%\lib\proto-google-common-protos-2.41.0.jar;%APP_HOME%\lib\protobuf-java-3.25.5.jar;%APP_HOME%\lib\grpc-util-1.68.1.jar;%APP_HOME%\lib\grpc-core-1.68.1.jar;%APP_HOME%\lib\grpc-protobuf-lite-1.68.1.jar;%APP_HOME%\lib\grpc-context-1.68.1.jar;%APP_HOME%\lib\grpc-api-1.68.1.jar;%APP_HOME%\lib\opentelemetry-context-1.42.1.jar;%APP_HOME%\lib\handy-uri-templates-2.1.8.jar;%APP_HOME%\lib\re2j-1.6.jar;%APP_HOME%\lib\guava-33.2.1-jre.jar;%APP_HOME%\lib\jsr305-3.0.2.jar;%APP_HOME%\lib\gson-2.11.0.jar;%APP_HOME%\lib\error_prone_annotations-2.28.0.jar;%APP_HOME%\lib\j2objc-annotations-2.8.jar;%APP_HOME%\lib\perfmark-api-0.27.0.jar;%APP_HOME%\lib\commons-digester-2.1.jar;%APP_HOME%\lib\commons-collections-3.2.2.jar;%APP_HOME%\lib\joda-time-2.10.2.jar;%APP_HOME%\lib\opentelemetry-semconv-1.25.0-alpha.jar;%APP_HOME%\lib\failureaccess-1.0.2.jar;%APP_HOME%\lib\listenablefuture-9999.0-empty-to-avoid-conflict-with-guava.jar;%APP_HOME%\lib\checker-qual-3.42.0.jar;%APP_HOME%\lib\animal-sniffer-annotations-1.24.jar;%APP_HOME%\lib\annotations-4.1.1.4.jar;%APP_HOME%\lib\okhttp-4.12.0.jar;%APP_HOME%\lib\okio-jvm-3.6.0.jar;%APP_HOME%\lib\kotlin-stdlib-jdk8-1.9.10.jar;%APP_HOME%\lib\kotlin-stdlib-jdk7-1.9.10.jar;%APP_HOME%\lib\kotlin-stdlib-1.9.10.jar;%APP_HOME%\lib\kotlin-stdlib-common-1.9.10.jar;%APP_HOME%\lib\annotations-13.0.jar


@rem Execute basic
"%JAVA_EXE%" %DEFAULT_JVM_OPTS% %JAVA_OPTS% %BASIC_OPTS%  -classpath "%CLASSPATH%" org.hyperledger.fabric.contract.ContractRouter %*

:end
@rem End local scope for the variables with windows NT shell
if %ERRORLEVEL% equ 0 goto mainEnd

:fail
rem Set variable BASIC_EXIT_CONSOLE if you need the _script_ return code instead of
rem the _cmd.exe /c_ return code!
set EXIT_CODE=%ERRORLEVEL%
if %EXIT_CODE% equ 0 set EXIT_CODE=1
if not ""=="%BASIC_EXIT_CONSOLE%" exit %EXIT_CODE%
exit /b %EXIT_CODE%

:mainEnd
if "%OS%"=="Windows_NT" endlocal

:omega
