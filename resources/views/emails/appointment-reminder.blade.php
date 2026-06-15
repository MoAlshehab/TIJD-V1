<!DOCTYPE html>
<html>
<head>
    <title>Afspraak herinnering</title>
</head>
<body>
<h2>Hallo {{ $appointment->user->name }},</h2>
<p>Dit is een herinnering voor je afspraak die gepland staat op <strong>{{ $appointment->date->format('d-m-Y H:i') }}</strong>.</p>
<p>We kijken ernaar uit je te zien!</p>
<p>Met vriendelijke groet,<br>Het team van jouw app</p>
</body>
</html>
