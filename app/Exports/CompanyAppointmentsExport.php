<?php

// //
// //namespace App\Exports;
// //
// //use App\Models\Appointment;
// //use Illuminate\Support\Facades\Auth;
// //use Illuminate\Support\Collection;
// //use Maatwebsite\Excel\Concerns\FromCollection;
// //use Maatwebsite\Excel\Concerns\WithHeadings;
// //use Maatwebsite\Excel\Concerns\WithMapping;
// //
// //class CompanyAppointmentsExport implements FromCollection, WithMapping, WithHeadings
// //{
// //    protected $appointments;
// //    protected $totalPrice = 0;
// //    protected $totalDuration = 0;
// //
// //    public function collection()
// //    {
// //        $user = Auth::user();
// //        $company = $user->company ?? $user->ownedCompany ?? null;
// //
// //        $this->appointments = Appointment::with(['user', 'employee', 'service', 'company'])
// //            ->where('company_id', $company->id)
// //            ->get();
// //
// //        return $this->appointments;
// //    }
// //
// //    public function map($appointment): array
// //    {
// //        $price = optional($appointment->service)->price ?? 0;
// //        $duration = optional($appointment->service)->duration ?? 0;
// //
// //        // Totals optellen
// //        $this->totalPrice += $price;
// //        $this->totalDuration += $duration;
// //
// //        return [
// //            $appointment->date,
// //            optional($appointment->user)->name,
// //            optional($appointment->employee)->name,
// //            optional($appointment->service)->name,
// //            $price + 1,
// //            $duration,
// //            optional($appointment->company)->name,
// //            $appointment->note,
// //            $appointment->created_at,
// //        ];
// //    }
// //
// //    public function headings(): array
// //    {
// //        return [
// //            'Datum',
// //            'Klant',
// //            'Werknemer',
// //            'Service',
// //            'Prijs',
// //            'Duur (min)',
// //            'Bedrijf',
// //            'Notitie',
// //            'Gemaakt op',
// //        ];
// //    }
// //
// //    public function __destruct()
// //    {
// //        // Dit wordt uitgevoerd nádat alle rijen geëxporteerd zijn
// //        // Daarom gebruiken we in de controller een aangepaste Collection
// //    }
// //
// //    // Extra: in je controller kun je dit doen om de totalen toe te voegen
// //    public function exportWithTotals()
// //    {
// //        $rows = $this->collection()->map(fn($appointment) => $this->map($appointment));
// //
// //        // Voeg de totaalrij toe
// //        $rows->push([
// //            '', '', '', 'Totaal:',
// //            $this->totalPrice,
// //            $this->totalDuration,
// //            '', '', ''
// //        ]);
// //
// //        return collect($rows);
// //    }
// //}
//
//
// namespace App\Exports;
//
// use App\Models\Appointment;
// use Illuminate\Support\Facades\Auth;
// use Maatwebsite\Excel\Concerns\FromCollection;
// use Maatwebsite\Excel\Concerns\WithMapping;
// use Maatwebsite\Excel\Concerns\WithHeadings;
//
// class CompanyAppointmentsExport implements FromCollection, WithMapping, WithHeadings
// {
//    protected $companyId; // Store the company ID
//    protected $appointments;
//    protected $totalPrice = 0;
//    protected $totalDuration = 0;
//
//    // Constructor to accept the company_id
//    public function __construct($companyId)
//    {
//        $this->companyId = 2;
//    }
//
//    public function collection()
//    {
//        // Haal de afspraken op voor het specifieke bedrijf
//        $this->appointments = Appointment::with(['user', 'employee', 'service', 'company'])
//            ->where('company_id',2)  // Filter op company_id
//            ->get();
//
//        return $this->appointments;
//    }
//
//    public function map($appointment): array
//    {
//        $price = optional($appointment->service)->price ?? 0;
//        $duration = optional($appointment->service)->duration ?? 0;
//
//        // Totals optellen
//        $this->totalPrice += $price;
//        $this->totalDuration += $duration;
//
//        return [
//            $appointment->date,
//            optional($appointment->user)->name,
//            optional($appointment->employee)->name,
//            optional($appointment->service)->name,
//            $price,
//            $duration,
//            optional($appointment->company)->name,
//            $appointment->note,
//            $appointment->created_at,
//        ];
//    }
//
//    public function headings(): array
//    {
//        return [
//            'Datum',
//            'Klant',
//            'Werknemer',
//            'Service',
//            'Prijs',
//            'Duur (min)',
//            'Bedrijf',
//            'Notitie',
//            'Gemaakt op',
//        ];
//    }
//
//    public function exportWithTotals()
//    {
//        $rows = $this->collection()->map(fn($appointment) => $this->map($appointment));
//
//        // Voeg de totaalrij toe
//        $rows->push([
//            '', '', '', 'Totaal:',
//            $this->totalPrice,
//            $this->totalDuration,
//            '', '', ''
//        ]);
//
//        return collect($rows);
//    }
// }
