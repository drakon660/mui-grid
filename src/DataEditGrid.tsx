/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from "react";
import {  
  GridRowsProp,
  GridRenderCellParams,
  useGridApiContext,
  DataGridPro,
  GridColDef,
  GridValueGetter,
  GridRowModel
} from "@mui/x-data-grid-pro";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";

type Countries = {
    [key: string]: string;
  };

const countries : Countries = {
 '1' : 'France',
 '2' : 'Spain',
 '3' : 'Brazil'
}

export default function StartEditButtonGrid() {
  const columns: GridColDef[] = [
    
      { field: "name", headerName: "Name", width: 180, editable: true },
      { field: "age", headerName: "Age", type: "number", editable: true },
      {
        field: "country",
        type: "singleSelect",
        width: 120,        
        editable: true, 
        valueOptions: Object.keys(countries).map(key => ({
            value: key,
            label: countries[key]
          })),
       
        valueGetter: (params: string) => {
            console.log(params);
            return countries[params as string] || ''
        },
        renderCell: (params: GridRenderCellParams) => <CustomComponent {...params} />
      }  
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGridPro
        rows={rows}
        columns={columns}
      />
    </div>
  );
}

const CustomComponent: React.FC<GridRenderCellParams> = (params) => {
  const apiRef = useGridApiContext();

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <div>{params.value}</div>
      <IconButton size="small" sx={{ padding: 0 }} tabIndex={-1}>
        <ArrowDropDownIcon
          onClick={(event) => {
            event.stopPropagation(); // to not select row
            apiRef.current.startCellEditMode({
              id: params.id,
              field: params.field
            });
          }}
        />
      </IconButton>
    </Box>
  );
};

const rows: GridRowsProp = [
  {
    id: 1,
    name: "John Doe",
    age: 25,
    country: "1"
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 36,
    country: "1"
  },
  {
    id: 3,
    name: "Alice Johnson",
    age: 19,
    country: "3"
  },
  {
    id: 4,
    name: "Michael Brown",
    age: 28,
    country: "3"
  },
  {
    id: 5,
    name: "Emily Davis",
    age: 23,
    country: "2"
  }
];