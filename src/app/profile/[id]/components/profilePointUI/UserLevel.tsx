"use client"

interface UserLevelProps { points: number }

type Level={
    name:string;
    min:number;
    max:number|null;
}

const levels: Level[]=[
    {name:"Microwave Apprentice", min: 0, max: 5},
    {name:"Drive-Thru Dreaner", min:6, max:15},
    {name:"Takeout Trainee", min: 16, max: 30},
    {name:"Flavor Sensei", min: 31, max: 50},
    {name:"Gourmet Goblin", min: 51, max: 70},
    {name:"Legendary Foodie", min: 71, max: null},

]

export default function UserLevel({points}:UserLevelProps) {
    //find first level such that level points>=level.min and <=level.max or is null. 
    const currentLevel=levels.find(level=>points>=level.min&&(level.max==null||points<=level.max)) //possibly null
    return (
        <div>
            THis is the User Level page.
            <div>
                {points}
            </div>
            <div>
                {currentLevel?.name ? currentLevel?.name : "Review your first restaurant!"}
            </div>
        </div>
    )
}


