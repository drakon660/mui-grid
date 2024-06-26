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
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";

type Countries = {
    [key: string]: string;
  };

const countries : Countries = {
 '1' : 'France',
 '2' : 'Spain',
 '3' : 'Brazil'
}

type Home = {
    id:number,
    value: string,
    age :number,
}

const diff = (old:Home[], newData:Home[]) : boolean => {
    let diff = false;

    for (const newItem of newData) {
        const oldItem = old.find(item => item.id === newItem.id);
        if (oldItem && oldItem.value !== newItem.value) {
          diff = true;
          break;
        }

      }
    return diff;
}

export default function StartEditButtonGrid() {
  const columns: GridColDef[] = [
    
      { field: "name", headerName: "Name", width: 180, editable: true },
      { field: "age", headerName: "Age", type: "number", editable: true },
      {
        field: "country",
        //type: "singleSelect",
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
        renderCell: (params: GridRenderCellParams) => <CustomComponent {...params} />,
        renderEditCell: (params: GridRenderCellParams) => <CustomSelectComponent {...params} />
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

const CustomSelectComponent: React.FC<GridRenderCellParams> = (params) => {
    const apiRef = useGridApiContext();
    const { id, field, value } = params;
  
    const handleChange = async (event: SelectChangeEvent<string>) => {
      const newValue = event.target.value as string;
      apiRef.current.setEditCellValue({ id, field, value: newValue });
      apiRef.current.stopCellEditMode({ id, field });
    };
  
    return (
      <Select
        value={value || '1'}
        onChange={handleChange}
        fullWidth
      >
        {Object.entries(countries).map(([key, label]) => (
          <MenuItem key={key} value={key}>
            {label}
          </MenuItem>
        ))}
      </Select>
    );
  };

const CustomComponent: React.FC<GridRenderCellParams> = (params) => {
   const  {api,id, field} = params;
   const apiRef = useGridApiContext();
   const [open, setOpen] = React.useState(false);

  const handleClick = (event:React.SyntheticEvent) => {
    event.stopPropagation();
    api.startCellEditMode({ id, field });
    setTimeout(() => {
      setOpen(true);
    }, 0);
  };


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
        <ArrowDropDownIcon onClick={(event)=>handleClick(event)}
        
        //   onClick={(event) => {

        //     // to not select row
        //     handleClick();
        //     // apiRef.current.startCellEditMode({
        //     //   id: params.id,
        //     //   field: params.field
        //     // });
        //   }}
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