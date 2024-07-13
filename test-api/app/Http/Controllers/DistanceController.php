<?php

namespace App\Http\Controllers;

use App\Models\Distance;
use Illuminate\Http\Request;
use Validator;
use App\Http\Controllers\BaseController as BaseController;
use App\Http\Resources\Distance as DistanceResource;

class DistanceController extends BaseController
{
    public function index()
    {
        $distances = Distance::get();
        
        return $this->sendResponse(DistanceResource::collection($distances), 'Distances Retrieved Successfully.');
    }

    public function store(Request $request)
    {
        $input = $request->all();
   
        $validator = Validator::make($input, [
            'arr_zipcodes'                          => ['required', 'array'],
            'arr_zipcodes.*.origin_zipcode'         => ['required', 'string', 'max:8'],
            'arr_zipcodes.*.destination_zipcode'    => ['required', 'string', 'max:8'],
            'arr_zipcodes.*.distance'               => ['required', 'numeric', 'max:9500'],
        ]);
   
        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());       
        }
        
        foreach ($input['arr_zipcodes'] as $zc_distance) {
            $distance = Distance::create($zc_distance);
        }

        return $this->sendResponse(DistanceResource::collection(Distance::get()), 'Distance Created Successfully.');
    }

    public function show($id)
    {
        $distance = Distance::findOrFail($id);
  
        if (is_null($distance)) {
            return $this->sendError('Distance not found.');
        }
   
        return $this->sendResponse(new DistanceResource($distance), 'Distance Retrieved Successfully.');
    }

    public function update(Request $request, $id)
    {
        $distance = Distance::findOrFail($id);
        if (is_null($distance)) {
            return $this->sendError('Distance not found.');
        }

        $input = $request->all();

        $validator = Validator::make($input, [
            'origin_zipcode'        => ['required', 'string', 'max:8'],
            'destination_zipcode'   => ['required', 'string', 'max:8'],
            'distance'              => ['required', 'numeric', 'max:9500'],
        ]);
        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());       
        }
   
        $distance->origin_zipcode       = $input['origin_zipcode'];
        $distance->destination_zipcode  = $input['destination_zipcode'];
        $distance->distance             = $input['distance'];
        $distance->save();

        return $this->sendResponse(new DistanceResource($distance), 'Distance Updated Successfully.');
    }

    public function destroy($id)
    {
        $distance = Distance::findOrFail($id);
        $distance->delete();
   
        return $this->sendResponse([], 'Product Deleted Successfully.');
    }
}

