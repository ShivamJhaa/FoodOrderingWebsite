const projects =[
    {
        id:1,
        title:"Samosa",
        img:"./imgs/samosa.jpg",
        price:"&#8377 10",
        category:"H1",
        
    },
    {
        id:2,
        title:"Plain Maggi",
        img:"./imgs/maggi.jpg",
        price:"&#8377 25",
        category:"H2",
        
    },
    {
        id:3,
        title:"Masala Maggi",
        img:"./imgs/maggi-1.jpg",
        price:"&#8377 30",
        category:"H3",
        
    },
    {
        id:4,
        title:"Chole Bhature",
        img:"./imgs/chole.jpg",
        price:"&#8377 50",
        category:"H1",
        
    },
    {
        id:5,
        title:"Pav Bhaji",
        img:"./imgs/pav.jpg",
        price:"&#8377 40",
        category:"H3",
        
    },
    {
        id:6,
        title:"Pizza",
        img:"./imgs/pizza.jpg",
        price:"&#8377 90",
        category:"H1",
        
    },
    {
        id:7,
        title:"Paneer Tikka",
        img:"./imgs/paneer.jpg",
        price:"&#8377 35",
        category:"H2",
        
    },
    {
        id:8,
        title:"Spring Roll",
        img:"./imgs/roll.jpg",
        price:"&#8377 30",
        category:"H2",
        
    },
    {
        id:9,
        title:"Chilli Patato",
        img:"./imgs/chilli.jpg",
        price:"&#8377 65",
        category:"H3",
        
    },
    {
        id:10,
        title:"Biryani",
        img:"./imgs/biryani.jpg",
        price:"&#8377 25",
        category:"H1",
        
    }
];

const sectionCenter= document.getElementById('projects');

const filterBtns = document.querySelectorAll('#port-btn');

window.addEventListener('DOMContentLoaded',function(){
    displayProjects(projects);
});
filterBtns.forEach(function(btn){
    btn.addEventListener('click',function (e){
        const category = e.currentTarget.dataset.id;
        const projectsCategory = projects.filter(function(projectsItem){
            if (projectsItem.category === category){
                return projectsItem;
            }
        })
        if (category === "all"){
            displayProjects(projects);
            
        }
        else {
            displayProjects(projectsCategory);
        }
    });
});


function displayProjects(projectsItems){
    let displayProjects = projectsItems.map(function(item){
        return `
        <div class="boxp">
        <article class="proj-item">
        <img src=${item.img} id="pro-img">
        </article>
        <div class="pro-con">
        <h6 class="item-head">${item.price}</h6>
        <h5 class="item-text">${item.title}</h5>
        <button type="button" class="secondary">Add</button>
        </div>
        </div>`;
    });
    displayProjects= displayProjects.join("");
    sectionCenter.innerHTML=displayProjects;
}