<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DistanceTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        \App\Models\Distance::create([
            'origin_zipcode' => '89037700',
            'destination_zipcode' => '89010025',
            'distance' => '7654',
        ]);
        // 2
        \App\Models\Distance::create([
            'origin_zipcode' => '88338200',
            'destination_zipcode' => '88330000',
            'distance' => '1242',
        ]);
    }
}
