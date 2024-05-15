import React, { useEffect, useRef, useState } from 'react';
import { DataGridPro, GridCellEditStopParams, GridColDef, GridRenderCellParams, GridRowId, useGridApiRef } from '@mui/x-data-grid-pro';
import { Select, MenuItem, SelectChangeEvent, InputAdornment, IconButton, TextField } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// Original RowData type without id
interface RawRowData {
  name: string;
  selectValue: string;
}

// Extended RowData type with id
interface RowDataWithId extends RawRowData {
  id: number;
}

const OptionTypes: { [key: string]: string } = {
  '1': 'Option 1',
  '2': 'Option 2',
  '3': 'Option 3',
};

const rawRows: RawRowData[] = [
  { name: 'John Doe', selectValue: '1' },
  { name: 'Jane Smith', selectValue: '2' },
];

// Function to map raw data to RowDataWithId with incremental ids
const mapRawDataToRowsWithId = (rawData: RawRowData[]): RowDataWithId[] => {
  return rawData.map((item, index) => ({ ...item, id: index + 1 }));
};

const initialRows: RowDataWithId[] = mapRawDataToRowsWithId(rawRows);

const CustomSelect: React.FC<GridRenderCellParams> = ({ id, value, api, field, row }) => {
  const [selectValue, setSelectValue] = useState<string>(value as string);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const newValue = event.target.value as string;
    setSelectValue(newValue);

    const updatedRow = { ...row, [field]: newValue, id: id };
    console.log(updatedRow);
    api.startCellEditMode({id, field});
    api.updateRows([updatedRow]);  
    api.setEditCellValue({id:id, field:field, value});
    api.stopCellEditMode({id, field});
  };

  return (
    <Select
      value={selectValue}
      onChange={handleChange}          
    >
      {Object.entries(OptionTypes).map(([key, label]) => (
        <MenuItem key={key} value={key}>
          {label}
        </MenuItem>
      ))}
    </Select>
  );
};

const CustomSelect2: React.FC<GridRenderCellParams> = ({ id, value, api, field, row }) => {
  const [selectValue, setSelectValue] = useState<string>(value as string);
  const selectRef = useRef<HTMLSelectElement | null>(null);
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    api.startCellEditMode({ id, field });
    setTimeout(() => {
      setOpen(true);      
    }, 0);
  };

  const handleChange = (event:SelectChangeEvent<string>) => {
    const newValue = event.target.value as string;
    setSelectValue(newValue);

    const updatedRow = { ...row, [field]: newValue, id: id };
    api.updateRows([updatedRow]);
    api.setEditCellValue({ id, field, value: newValue });
    api.stopCellEditMode({ id, field });
  };

  const handleBlur = () => {
    setOpen(false);
    api.stopCellEditMode({ id, field });
  };

  useEffect(() => {
    setSelectValue(value as string);
  }, [value]);

  return api.getCellMode(id, field) === 'edit' ? (
    <Select
      onBlur={handleBlur}
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
    </Select>
  ) : (
    <TextField
      value={OptionTypes[selectValue] || ''}
      InputProps={{
        readOnly: true,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton edge="end" onClick={handleClick}>
              <ArrowDropDownIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 150 },
  {
    field: 'selectValue',
    headerName: 'Select Value',   
    width: 150,
    editable:true,            
    renderCell: (params) => <CustomSelect2 {...params} /> ,  
    renderEditCell: (params) => <CustomSelect2 {...params} />   
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
    console.log("process");
    const updatedRows = rows.map((row) => (row.id === oldRow.id ? oldRow : row));

    console.log(updatedRows);
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

  const handleCellEditStop = (params: GridCellEditStopParams) => {
    const { id, field } = params;
    const row = apiRef.current.getRow(id);
    if (row) {
      const updatedRow = { ...row, [field]: apiRef.current.getCellValue(id,field) };
      const updatedRows = rows.map((row) => (row.id === id ? updatedRow : row));
      setRows(updatedRows);
    }
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
          onCellEditStop={handleCellEditStop}              
          processRowUpdate={handleProcessRowUpdate}         
        />
    
    </>
  );
};

export default DataEditGridExample;
