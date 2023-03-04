import React, { useState } from "react";
import useJsonForm from "./formData/useJsonForm";
import './App.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Button, InputLabel, MenuItem, Modal, Select, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, TextField } from "@mui/material";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ReactJson from 'react-json-view'

const App = () => {
  const { formStructure } = useJsonForm()
  const [formData, setFormData] = useState({});
  const [open, setOpen] = React.useState(false);
  const [selectedDropDownOptions, setSelectedDropDownOptions] = useState([])

  const handleOpen = (e) => {
    e.preventDefault()
    setOpen(true)
  };
  const handleClose = () => setOpen(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDropdownChange = async (event) => {
    const request = await fetch(`https://jsonplaceholder.typicode.com/todos/${event.target.value}`)
    const selected = await request.json()
    const existingOptionIndex = selectedDropDownOptions.findIndex(item => item.name === event.target.name);

    if (existingOptionIndex === -1) {
      const newOptions = [...selectedDropDownOptions, { name: event.target.name, options: [selected] }];
      setSelectedDropDownOptions(newOptions);
      setFormData({ ...formData, [event.target.name]: newOptions });
    } else {
      const updatedOption = { ...selectedDropDownOptions[existingOptionIndex], options: [...selectedDropDownOptions[existingOptionIndex].options, selected] };
      const newOptions = [...selectedDropDownOptions.slice(0, existingOptionIndex), updatedOption, ...selectedDropDownOptions.slice(existingOptionIndex + 1)];
      setSelectedDropDownOptions(newOptions);
      setFormData({ ...formData, [event.target.name]: newOptions });
    }
  };

  const renderFormItem = (item) => {
    switch (item['data-buildertype'] || item["item-type"]) {
      case "form":
        return (
          <div key={item.id}>
            {item.children.map((child) => renderFormItem(child))}
          </div>
        );
      case "header":
        return (
          <div key={item.id}>
            <h2 style={{ fontSize: item.size, textAlign: item.textAlign }}>
              {item.content}
            </h2>
            {item.subheader && <p>{item.subheader}</p>}
          </div>
        );
      case "input":
        return (
          <div className='field-container' key={item.id}>
            <TextField
              label={item.label}
              type="text"
              name={item["id"]}
              onChange={handleInputChange}
              required={item["other-required"]}
              sx={{ width: item.fluid ? "100%" : "auto" }}
            />
          </div>
        );
      case "formgroup":
        return (
          <div key={item.id}>
            {item.children.map((child) => renderFormItem(child))}
          </div>
        );
      case "dropdown":
        return (
          <div className='field-container' key={item.id}>
            <InputLabel id={item["id"]}>{item.label}</InputLabel>
            <Select
              className='select-input'
              name={item["id"]}
              onChange={(e) => handleDropdownChange(e)}
              required={item["other-required"]}
              style={{ width: item.fluid ? "100%" : "auto" }}
            >
              {item["data-elements"].map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.title}
                </MenuItem>
              ))}
            </Select>
          </div>
        );
      case "textarea":
        return (
          <div className='field-container' key={item.id}>
            <InputLabel id={item["id"]}>{item.label}</InputLabel>
            <TextField
              multiline
              name={item["id"]}
              onChange={handleInputChange}
              rows={item.rows}
              style={{ width: item.fluid ? "100%" : "auto" }}
            />
          </div>
        );
      case "gridview":
        return (
          <div className='field-container' key={item.id}>
            <Table >
              <TableHead>
                <TableRow>
                  {item.columns.map((column) => (
                    <TableCell className="table-cell" key={column.id}>
                      {column.sortable && <TableSortLabel onClick={()=> alert('abc')}>
                        {column.name}
                      </TableSortLabel>
                      }
                      {column.filterable && <FilterAltIcon className="filter-icon" />}
                      { (!column.filterable && !column.sortable) &&  column.name}

                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  selectedDropDownOptions?.filter(elem => elem.name === 'type')?.[0]?.options?.map((item) => (
                    <TableRow key={item?.id}>
                      <TableCell>
                        {item?.id}
                      </TableCell>
                      <TableCell>
                        {item?.title}
                      </TableCell>
                      <TableCell>
                        {item?.completed ? 'Yes' : 'No'}
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </div>
        );
      case "button":
        return (
          <div className='field-container' key={item.id}>
            <Button
              variant={item.primary ? "contained" : "outlined"}
             
              style={{ width: item.fluid ? "100%" : "auto" }}
              type='submit'
            >
              {item.content}
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="app">
    <form  onSubmit={handleOpen} className="form-container">{formStructure.map((item) => renderFormItem(item))}</form>
    <Modal
      open={open}
      onClose={handleClose}
    >
      <div className="model">
        <ReactJson displayDataTypes={false} style={{ width: '100%', padding: '50px', borderRadius: '10px' }} theme={'paraiso'} src={formData} />
      </div>
    </Modal>
  </div>;
};

export default App;
