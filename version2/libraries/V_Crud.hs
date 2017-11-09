module V_Crud (library) where

import Library

library :: Library
library = Library "v_crud"
    [ Item "rain" ["description: Rain", "imgURL: ./data/img/rain.png",
                   "graphElement: nodal", "layer: domain"] $
         rain ::: "amount" # tInt .->
         tGCM ("rotation: true" # "incomingType: none" # "outgoingType: arbitrary" #
               "rainfall" # tPort tInt)
    ]

rain :: Int -> GCM (Port Int)
rain amount = do
  port <- createPort
  set port amount
  return port

