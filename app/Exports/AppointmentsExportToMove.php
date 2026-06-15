<?php

namespace App\Exports;

use App\Models\Appointment;
use App\Models\User;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Events\AfterSheet;

class AppointmentsExportToMove implements FromQuery, WithEvents, WithHeadings, WithMapping
{
    protected $totalPrice = 0;

    protected $totalDuration = 0;

    public function query()
    {
        $companyId = auth()->user()->company_id;

        return Appointment::query()
            ->with(['user', 'service', 'company'])
            ->where('company_id', $companyId);
    }

    public function map($appointment): array
    {
        $price = optional($appointment->service)->price ?? 0;
        $duration = optional($appointment->service)->duration ?? 0;

        $this->totalPrice += $price;
        $this->totalDuration += $duration;

        // werknemer ophalen
        $employee = User::find($appointment->employee_id);

        return [
            $appointment->date,
            $appointment->user_id,              // 🔹 ID i.p.v. naam klant
            optional($employee)->id,            // 🔹 ID werknemer
            optional($appointment->service)->id, // 🔹 Service ID
            $price,
            $duration,
            $appointment->company_id,           // 🔹 Bedrijf ID
            $appointment->note,
            $appointment->created_at,
        ];
    }

    public function headings(): array
    {
        return [
            'Datum',
            'Klant ID',
            'Werknemer ID',
            'Service ID',
            'Prijs',
            'Duur (min)',
            'Bedrijf ID',
            'Notitie',
            'Gemaakt op',
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $row = $event->sheet->getHighestRow() + 1;

                $event->sheet->setCellValue("A{$row}", 'Totaal');
                $event->sheet->setCellValue("E{$row}", $this->totalPrice);
                $event->sheet->setCellValue("F{$row}", $this->totalDuration);
            },
        ];
    }
}
