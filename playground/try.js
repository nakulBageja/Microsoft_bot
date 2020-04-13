const card = require('../Cards/profile.json')

       console.log( card.body[1].columns[0].items[0])     
            card.body[1].columns[0].items[0].text = "userProfile.name";
            
            for(let i = 0;i < 4; i++){
                var val = card.body[2].facts[i].title;
                if(val === 'Age')
                    card.body[2].facts[i].value = "21"
                else if(val === 'Gender')
                    card.body[2].facts[i].value = "MALE"
                else if(val === 'Number')
                    card.body[2].facts[i].value = "userProfile.number"
                else if(val === 'Email')
                    card.body[2].facts[i].value = "userProfile.email"
            }
            console.log(  card.body[2].facts[0].value )