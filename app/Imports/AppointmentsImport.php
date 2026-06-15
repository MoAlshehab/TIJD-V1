<?php

namespace App\Imports;

use App\Models\Appointment;
use App\Models\Service;
use App\Models\User;
use Illuminate\Support\Carbon;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class AppointmentsImport implements ToModel, WithHeadingRow
{
    protected $companyId;

    public function __construct(int $companyId)
    {
        $this->companyId = $companyId;
    }

    public function model(array $row)
    {
        // Verwachte kolomnamen zoals in export
        $datum = $row['datum'] ?? null;
        $klant = $row['klant'] ?? 'Onbekend';
        $werknemer = $row['werknemer'] ?? 'Onbekend';
        $serviceNaam = $row['service'] ?? 'Onbekend';
        $prijs = $row['prijs'] ?? 0;
        $duur = $row['duur_(min)'] ?? ($row['duur (min)'] ?? 0); // dubbele naam fallback
        $notitie = $row['notitie'] ?? null;

        // Datum veilig parsen
        $date = $datum ? Carbon::parse($datum) : now();

        // Maak of zoek klant
        $user = User::firstOrCreate(
            ['name' => $klant],
            ['email' => null] // voorkom unique errors
        );

        // Maak of zoek werknemer
        $employee = User::firstOrCreate(
            ['name' => $werknemer],
            ['email' => null]
        );

        // Maak of zoek service
        $service = Service::firstOrCreate(
            [
                'name' => $serviceNaam,
                'company_id' => $this->companyId,
            ],
            [
                'price' => $prijs,
                'duration' => $duur,
            ]
        );

        // Nieuwe afspraak aanmaken
        return new Appointment([
            'company_id' => $this->companyId,
            'employee_id' => $employee->id,
            'service_id' => $service->id,
            'user_id' => $user->id,
            'date' => $date,
            'note' => $notitie,
        ]);
    }
}
