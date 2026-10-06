<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">

    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #222;
        }

        h1 {
            margin-bottom: 4px;
        }

        .subtitle {
            color: #666;
            margin-bottom: 20px;
        }

        .summary {
            margin-bottom: 25px;
        }

        .summary-box {
            display: inline-block;
            margin-right: 25px;
            margin-bottom: 8px;
        }

        .summary-label {
            font-size: 11px;
            color: #666;
        }

        .summary-value {
            font-size: 16px;
            font-weight: bold;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th {
            text-align: left;
            background: #eee;
            padding: 8px 6px;
            border-bottom: 1px solid #ccc;
        }

        td {
            padding: 7px 6px;
            border-bottom: 1px solid #ddd;
        }

        .price {
            text-align: right;
        }

        .total-row {
            font-weight: bold;
        }

        .footer {
            margin-top: 30px;
            font-size: 10px;
            color: #777;
        }
    </style>
</head>

<body>

<h1>
    Afsprakenoverzicht
</h1>

<div class="subtitle">
    {{ $periodLabel }}

    <br>

    {{ $start->format('d-m-Y') }}
    t/m
    {{ $end->format('d-m-Y') }}
</div>


<div class="summary">

    <div class="summary-box">
        <div class="summary-label">
            Aantal afspraken
        </div>

        <div class="summary-value">
            {{ $totalAppointments }}
        </div>
    </div>


    <div class="summary-box">
        <div class="summary-label">
            Geaccepteerd
        </div>

        <div class="summary-value">
            {{ $acceptedAppointments }}
        </div>
    </div>


    <div class="summary-box">
        <div class="summary-label">
            Voltooid
        </div>

        <div class="summary-value">
            {{ $doneAppointments }}
        </div>
    </div>


    <div class="summary-box">
        <div class="summary-label">
            Totale waarde
        </div>

        <div class="summary-value">
            € {{ number_format(
                $totalPrice,
                2,
                ',',
                '.'
            ) }}
        </div>
    </div>

</div>


<table>

    <thead>
        <tr>
            <th>#</th>
            <th>Klant</th>
            <th>Bedrijf</th>
            <th>Dienst</th>
            <th>Datum</th>
            <th>Status</th>
            <th class="price">Prijs</th>
        </tr>
    </thead>

    <tbody>

    @forelse($appointments as $appointment)

        @php
            $price =
                $appointment->custom_price
                ?? $appointment->service?->price
                ?? 0;
        @endphp

        <tr>
            <td>
                {{ $appointment->id }}
            </td>

            <td>
                {{ $appointment->user?->name ?? '-' }}
            </td>

            <td>
                {{ $appointment->company?->name ?? '-' }}
            </td>

            <td>
                {{ $appointment->service?->name ?? '-' }}
            </td>

            <td>
                {{ \Carbon\Carbon::parse(
                    $appointment->date
                )->format('d-m-Y H:i') }}
            </td>

            <td>
                @if($appointment->done)
                    Voltooid
                @elseif($appointment->accept)
                    Geaccepteerd
                @else
                    Open
                @endif
            </td>

            <td class="price">
                € {{ number_format(
                    (float) $price,
                    2,
                    ',',
                    '.'
                ) }}
            </td>
        </tr>

    @empty

        <tr>
            <td colspan="7">
                Geen afspraken gevonden in deze periode.
            </td>
        </tr>

    @endforelse


    @if($appointments->isNotEmpty())

        <tr class="total-row">
            <td colspan="6">
                Totaal
            </td>

            <td class="price">
                € {{ number_format(
                    $totalPrice,
                    2,
                    ',',
                    '.'
                ) }}
            </td>
        </tr>

    @endif

    </tbody>

</table>


<div class="footer">
    Gegenereerd op
    {{ now()->format('d-m-Y H:i') }}
</div>

</body>
</html>