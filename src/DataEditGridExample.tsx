import React, { useEffect, useRef, useState } from 'react';
import {
  DataGridPro,
  GridCellEditStopParams,
  GridCellEditStopReasons,
  GridColDef,
  GridRenderCellParams,
  GridRowId,
  MuiEvent,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import {
  Select,
  MenuItem,
  SelectChangeEvent,
  InputAdornment,
  IconButton,
  TextField,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

// Original RowData type without id
class RawRowData {
  name?: string;
  selectValue?: string;
  init(_data?: any): void {
    // Initialization logic
  }
  toJson(data?: any): any {
    return data;
  }
}

// Extended RowData type with id
interface RowDataWithId extends Omit<RawRowData, 'init' | 'toJson'> {
  id: number;
}

const OptionTypes: { [key: string]: string } = {
  '1': 'Option 1',
  '2': 'Option 2',
  '3': 'Option 3',
};

const rawRows: RawRowData[] = [
  { name: 'John Doe', selectValue: '1', init: function () {}, toJson: function () { return {}; } },
  { name: 'Jane Smith', selectValue: '2', init: function () {}, toJson: function () { return {}; } },
];

// Function to map raw data to RowDataWithId with incremental ids
const mapRawDataToRowsWithId = (rawData: RawRowData[]): RowDataWithId[] => {
  return rawData.map((item, index) => {
    const row = new RawRowData();
    row.name = item.name;
    row.selectValue = item.selectValue;
    row.init = item.init;
    row.toJson = item.toJson;
    return { ...row, id: index + 1 };
  });
};

const initialRows: RowDataWithId[] = mapRawDataToRowsWithId(rawRows);

const CustomSelect2: React.FC<GridRenderCellParams> = ({ id, value, api, field, row, focusElementRef, cellMode, hasFocus }) => {
  const [selectValue, setSelectValue] = useState<string>(value as string);
  const [open, setOpen] = useState(false);
  const selectRef = useRef<HTMLSelectElement | null>(null);
  const apiRef = useGridApiRef();
  const handleClick = () => {
    api.startCellEditMode({ id, field });
    setTimeout(() => {
      setOpen(true);
    }, 0);
  };

  const handleChange = async (event: SelectChangeEvent<string>) => {
     console.log("onchange");    
  
    const newValue = event.target.value as string;
    setSelectValue(newValue);

    const updatedRow = { ...row, [field]: newValue, id: id };
    api.updateRows([updatedRow]);
    console.log(updatedRow);  
    debugger;  
    const isValid = await api.setEditCellValue({ id, field, value: newValue });
    console.log(isValid);
    // if (isValid) api.stopCellEditMode({ id, field });    

    // api.publishEvent('cellEditStop', api.getCellParams(id,field));

    console.log(hasFocus);    
  };

  // const handleBlur = () => {
  //   console.log('blur');
  //   setOpen(false);
  //   api.stopCellEditMode({ id, field });
  // };


  return (<Select
  //onBlur={handleBlur}
  open={open}
  value={selectValue}
  onChange={handleChange}
  inputRef={selectRef}
  onClose={() => setOpen(false)}
  onOpen={() => setOpen(true)}
  autoFocus
  fullWidth
  sx={{ width: '100%' }}
>
  {Object.entries(OptionTypes).map(([key, label]) => (
    <MenuItem key={key} value={key}>
      {label}
    </MenuItem>
  ))}
</Select>)

  // return api.getCellMode(id, field) === 'edit' ? (
   
  // ) : (
  //   <TextField
  //     value={OptionTypes[selectValue] || ''}
  //     InputProps={{
  //       readOnly: true,
  //       endAdornment: (
  //         <InputAdornment position="end">
  //           <IconButton edge="end" onClick={handleClick}>
  //             <ArrowDropDownIcon />
  //           </IconButton>
  //         </InputAdornment>
  //       ),
  //     }}
  //   />
  // );
};

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 150 },
  {
    field: 'selectValue',
    headerName: 'Select Value',
    width: 150,
    editable: false,
    renderCell: (params) => <CustomSelect2 {...params} />,
    //renderEditCell: (params) => <CustomSelect2 {...params} />,
  },
];

const DataEditGridExample: React.FC = () => {
  const [rows, setRows] = useState<RowDataWithId[]>(initialRows);
  const apiRef = useGridApiRef();

  const getRowId = (row: RowDataWithId): GridRowId => row.id;

  const show = () => {
    console.log(rows);
    console.log(apiRef.current.getRowModels());
  };

  const handleProcessRowUpdate = (newRow: RowDataWithId, oldRow: RowDataWithId) => {
    const updatedRows = rows.map((row) => (row.id === oldRow.id ? newRow : row));
    setRows(updatedRows);

    // Log changed data
    const changedFields: { [key: string]: { old: any, new: any } } = {};
    for (const key in newRow) {
      if (newRow[key as keyof RowDataWithId] !== oldRow[key as keyof RowDataWithId]) {
        changedFields[key] = { old: oldRow[key as keyof RowDataWithId], new: newRow[key as keyof RowDataWithId] };
      }
    }

    return newRow;
  };

  return (
    <>
      <p>dziala</p>
      <button onClick={show}>click</button>
      <DataGridPro
        rows={rows}
        apiRef={apiRef}
        columns={columns}
        editMode="cell"
        getRowId={getRowId}        
        onCellKeyDown={(params, event) => {
          console.log('cell key down', params, event);
        }}
        onCellEditStart={(params, event) => {
          console.log('cell edit start', params, event);
        }}
        onCellEditStop={(params: GridCellEditStopParams, event: MuiEvent) => {
          console.log('cell edit stop', params, event);
        }}
        processRowUpdate={handleProcessRowUpdate}
      />
    </>
  );
};

export default DataEditGridExample;
