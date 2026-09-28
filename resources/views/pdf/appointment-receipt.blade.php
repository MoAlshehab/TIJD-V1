<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">

    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 14px;
            color: #222;
        }

        .container {
            width: 100%;
        }

        h1 {
            font-size: 24px;
            margin-bottom: 5px;
        }

        .subtitle {
            color: #666;
            margin-bottom: 30px;
        }

        .section {
            margin-bottom: 25px;
        }

        .row {
            margin-bottom: 8px;
        }

        .label {
            font-weight: bold;
            display: inline-block;
            width: 160px;
        }

        .price {
            font-size: 20px;
            font-weight: bold;
            margin-top: 20px;
        }

        .footer {
            margin-top: 50px;
            font-size: 11px;
            color: #777;
        }
    </style>
</head>

<body>

<div class="container">

    <h1>Afspraak voltooid</h1>

    <div class="subtitle">
        Afspraak #{{ $appointment->id }}
    </div>

    <div class="section">

        <h3>Klantgegevens</h3>

        <div class="row">
            <span class="label">Naam:</span>
            {{ $appointment->user?->name ?? '-' }}
        </div>

        <div class="row">
            <span class="label">E-mail:</span>
            {{ $appointment->user?->email ?? '-' }}
        </div>

    </div>

    <div class="section">

        <h3>Afspraakgegevens</h3>

        <div class="row">
            <span class="label">Bedrijf:</span>
            {{ $appointment->company?->name ?? '-' }}
        </div>

        <div class="row">
            <span class="label">Dienst:</span>
            {{ $appointment->service?->name ?? '-' }}
        </div>

        <div class="row">
            <span class="label">Datum:</span>
            {{ \Carbon\Carbon::parse($appointment->date)->format('d-m-Y') }}
        </div>

        <div class="row">
            <span class="label">Tijd:</span>
            {{ \Carbon\Carbon::parse($appointment->date)->format('H:i') }}
        </div>

        @if($appointment->note)
            <div class="row">
                <span class="label">Notitie:</span>
                {{ $appointment->note }}
            </div>
        @endif

    </div>

    <div class="price">
        Totaal:
        € {{ number_format($price, 2, ',', '.') }}
    </div>

    <div class="footer">
        Gegenereerd op {{ now()->format('d-m-Y H:i') }}
    </div>

</div>

</body>
</html>