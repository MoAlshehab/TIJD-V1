<?php

namespace App\Exports;

use App\Models\Appointment;
use App\Models\User;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Events\AfterSheet;

class AppointmentsExport implements FromQuery, WithEvents, WithHeadings, WithMapping
{
    protected $totalPrice = 0;

    protected $totalDuration = 0;

    public function query()
    {
        $companyId = auth()->user()->company_id;

        return Appointment::query()
            ->with(['user', 'service']) // employee relatie via user-model
            ->where('company_id', $companyId);
    }

    public function map($appointment): array
    {
        $price = optional($appointment->service)->price ?? 0;
        $duration = optional($appointment->service)->duration ?? 0;

        $this->totalPrice += $price;
        $this->totalDuration += $duration;

        // werknemer ophalen uit users-tabel via employee_id
        $employee = User::find($appointment->employee_id);

        return [
            $appointment->date,
            optional($appointment->user)->name,               // klant
            optional($employee)->name,                        // werknemer
            optional($appointment->service)->name,
            $price,
            $duration,
            optional($appointment->company)->name,
            $appointment->note,
            $appointment->created_at,
        ];
    }

    public function headings(): array
    {
        return [
            'Datum',
            'Klant',
            'Werknemer',
            'Service',
            'Prijs',
            'Duur (min)',
            'Bedrijf',
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
