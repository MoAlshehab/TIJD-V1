<?php

namespace App\Exports;

use App\Models\Company;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ComapniesExport implements FromQuery, WithHeadings, WithMapping
{
    public function query()
    {
        return Company::query();
    }

    public function map($row): array
    {
        return [
            $row->name,
            $row->kind,
            $row->email,
            $row->phone,
            $row->address,
            $row->city,
            $row->zip,
            $row->created_at,
        ];
    }

    public function headings(): array
    {
        return [
            'Name',
            'Kind',
            'Emailaddress',
            'Phonenumber',
            'Adress',
            'City',
            'Zip',
            'created_at',
        ];
    }
}
