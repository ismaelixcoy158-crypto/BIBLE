Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
currentDir = fso.GetParentFolderName(WScript.ScriptFullName)
WshShell.CurrentDirectory = currentDir

' Ejecutar BIBLE sin ventana de consola negra (0 = oculta)
WshShell.Run "cmd /c node scripts\start.js", 0, False
Set WshShell = Nothing
Set fso = Nothing

