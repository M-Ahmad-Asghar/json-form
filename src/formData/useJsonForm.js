import React from 'react'

function useJsonForm() {
  const [todos, setTodos] = React.useState([])
  React.useEffect(() => {
    const getTodos = async () => {
      try {
        const request = await fetch('https://jsonplaceholder.typicode.com/todos')
        const data = await request.json()
        setTodos(data.slice(0, 10))
      } catch (error) {
        alert(error.message)
      }
    }
    getTodos()
  }, [])

 const formStructure = [
  {
    id: "header_1",
    "item-type": "header",
    content: "Application Form",
    size: "medium",
    subheader: "Make it easier",
    textAlign: "center"
  },
  {
    id: "form_1",
    "item-type": "form",
    children: [
      {
        id: "title",
        "item-type": "input",
        label: "Title",
        fluid: true,
        "other-required": false
      },
      {
        id: "formgroup_1",
        "item-type": "formgroup",
        widths: "equal",
        children: [
          {
            id: "firstname",
            "item-type": "input",
            label: "First name",
            fluid: true
          },
          {
            id: "lastname",
            "item-type": "input",
            label: "Last name",
            fluid: true
          }
        ]
      },
      {
        id: "type",
        "item-type": "dropdown",
        label: "Type",
        fluid: true,
        selection: true,
        "data-elements": todos,
        placeholder: ""
      },
      {
        id: "comment",
        "item-type": "textarea",
        label: "Comment",
        fluid: true,
        rows: 5
      }
    ]
  },
  {
    id: "gridview_1",
    "item-type": "gridview",
    columns: [
      {
        id: "id",
        name: "ID",
        sortable: true,
        filterable: false,
        resizable: false
      },
      {
        id: "title",
        name: "Title",
        sortable: false,
        filterable: false,
        resizable: false
      },
      {
        id: "completed",
        name: "Done",
        sortable: false,
        filterable: false,
        resizable: false
      }
    ]
  },
  {
    id: "btnDisplay",
    "data-buildertype": "button",
    content: "Display JSON",
    primary: true,
    fluid: false,
    events: {}
  }
]
  return {formStructure}
}

export default useJsonForm
