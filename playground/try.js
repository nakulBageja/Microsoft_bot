const bill = require('../Cards/bill')


for( let i = 0; i<3;i++){
    bill.body[2 + i] ={
        "type": "ColumnSet",
        "columns": [
            {
                "type": "Column",
                "items": [
                    {
                        "type": "TextBlock",
                        "horizontalAlignment": "Center",
                        "text": "1",
                        "wrap": true
                    }
                ],
                "width": "auto"
            },
            {
                "type": "Column",
                "spacing": "Medium",
                "items": [
                    {
                        "type": "TextBlock",
                        "text": "chicken",
                        "wrap": true
                    }
                ],
                "width": "stretch"
            },
            {
                "type": "Column",
                "items": [
                    {
                        "type": "TextBlock",
                        "text": "money",
                        "wrap": true
                    }
                ],
                "width": "auto"
            }
        ]
    }
    // total_amt += order_details.items[i][2]
}
bill.body[2 + 3 - 1] =  {
    "type": "ColumnSet",
    "spacing": "Large",
    "separator": true,
    "columns": [
        {
            "type": "Column",
            "items": [
                {
                    "type": "TextBlock",
                    "horizontalAlignment": "Right",
                    "text": "Total Expense Amount \t",
                    "wrap": true
                }
            ],
            "width": "stretch"
        },
        {
            "type": "Column",
            "items": [
                {
                    "type": "TextBlock",
                    "text": "(-) 0.00 \t"
                }
            ],
            "width": "auto"
        }
    ]
}
bill.body[2 + 3] = {
            "type": "Container",
            "items": [
                {
                    "type": "ActionSet",
                    "actions": [
                        {
                            "type": "Action.Submit",
                            "title": "Approve",
                            "style": "positive",
                            "data": {
                                "id": "_qkQW8dJlUeLVi7ZMEzYVw",
                                "action": "approve"
                            }
                        }
                    ]
                }
            ]
        }
console.log(JSON.stringify(bill))