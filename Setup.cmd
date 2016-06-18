@ECHO off

SET SourcePath1="%CD%\Breeze"
SET SourcePath2="%CD%\CatBlock"
SET SourcePath3="%CD%\Flying YouTube"
SET SourcePath4="%CD%\Turn Off the Lights"
SET SourcePath5="%CD%\Tweeten"
SET SourcePath6="%CD%\Instant Translate"
SET SourcePath01="%CD%\legacy\Microsoft Translator"
SET SourcePath02="%CD%\legacy\Mouse Gestures"
SET SourcePath03="%CD%\legacy\OneNote Clipper"
SET SourcePath04="%CD%\legacy\Pin It Button"
SET SourcePath05="%CD%\legacy\RES"

ECHO Attempting to set access permissions on all extensions.....
ECHO ***********************************************************
ECHO.
icacls %SourcePath1% /grant "*S-1-15-2-3624051433-2125758914-1423191267-1740899205-1073925389-3782572162-737981194":"(OI)(CI)(WDAC,WO,GE)"
ECHO -----------------------------------------------------------
ECHO Access permissions to Breeze granted.
ECHO -----------------------------------------------------------
ECHO.
icacls %SourcePath2% /grant "*S-1-15-2-3624051433-2125758914-1423191267-1740899205-1073925389-3782572162-737981194":"(OI)(CI)(WDAC,WO,GE)"
ECHO -----------------------------------------------------------
ECHO Access permissions to CatBlock granted.
ECHO -----------------------------------------------------------
ECHO.
icacls %SourcePath3% /grant "*S-1-15-2-3624051433-2125758914-1423191267-1740899205-1073925389-3782572162-737981194":"(OI)(CI)(WDAC,WO,GE)"
ECHO -----------------------------------------------------------
ECHO Access permissions to Flying YouTube granted.
ECHO -----------------------------------------------------------
ECHO.
icacls %SourcePath4% /grant "*S-1-15-2-3624051433-2125758914-1423191267-1740899205-1073925389-3782572162-737981194":"(OI)(CI)(WDAC,WO,GE)"
ECHO -----------------------------------------------------------
ECHO Access permissions to Instant Translate granted.
ECHO -----------------------------------------------------------
ECHO.
icacls %SourcePath5% /grant "*S-1-15-2-3624051433-2125758914-1423191267-1740899205-1073925389-3782572162-737981194":"(OI)(CI)(WDAC,WO,GE)"
ECHO -----------------------------------------------------------
ECHO Access permissions to Turn Off the Lights granted.
ECHO -----------------------------------------------------------
ECHO.
icacls %SourcePath6% /grant "*S-1-15-2-3624051433-2125758914-1423191267-1740899205-1073925389-3782572162-737981194":"(OI)(CI)(WDAC,WO,GE)"
ECHO -----------------------------------------------------------
ECHO Access permissions to Tweeten granted.
ECHO -----------------------------------------------------------

IF "%1" == "-l" GOTO foundit

IF "%1" == "legacy" GOTO foundit

GOTO end

:foundit
  ECHO Attempting to set access permissions on legacy extensions.....
  ECHO ***********************************************************
  ECHO.
  icacls %SourcePath01% /grant "*S-1-15-2-3624051433-2125758914-1423191267-1740899205-1073925389-3782572162-737981194":"(OI)(CI)(WDAC,WO,GE)"
  ECHO -----------------------------------------------------------
  ECHO Access permissions to Microsoft Translator granted.
  ECHO -----------------------------------------------------------
  ECHO.
  icacls %SourcePath02% /grant "*S-1-15-2-3624051433-2125758914-1423191267-1740899205-1073925389-3782572162-737981194":"(OI)(CI)(WDAC,WO,GE)"
  ECHO -----------------------------------------------------------
  ECHO Access permissions to Mouse Gestures granted.
  ECHO -----------------------------------------------------------
  ECHO.
  icacls %SourcePath03% /grant "*S-1-15-2-3624051433-2125758914-1423191267-1740899205-1073925389-3782572162-737981194":"(OI)(CI)(WDAC,WO,GE)"
  ECHO -----------------------------------------------------------
  ECHO Access permissions to OneNote Clipper granted.
  ECHO -----------------------------------------------------------
  ECHO.
  icacls %SourcePath04% /grant "*S-1-15-2-3624051433-2125758914-1423191267-1740899205-1073925389-3782572162-737981194":"(OI)(CI)(WDAC,WO,GE)"
  ECHO -----------------------------------------------------------
  ECHO Access permissions to Pin It Button granted.
  ECHO -----------------------------------------------------------
  ECHO.
  icacls %SourcePath05% /grant "*S-1-15-2-3624051433-2125758914-1423191267-1740899205-1073925389-3782572162-737981194":"(OI)(CI)(WDAC,WO,GE)"
  ECHO -----------------------------------------------------------
  ECHO Access permissions to RES granted.
  ECHO -----------------------------------------------------------

:end
  ECHO Done! Enjoy the extensions.
  pause
