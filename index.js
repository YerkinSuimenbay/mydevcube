const fs = require('fs')
const axios = require('axios')
const yargs = require('yargs');


// AXIOS
const URL = 'https://api.app.shortcut.com/api/v3/projects'
const TOKEN = '6256ab94-efbb-4426-8d04-218bbc1156fc'



const fetchProjects = async () => {
    try {
        const res = await axios.get(
            URL, 
            {
                headers: { "Shortcut-Token": TOKEN }
            }
        )
        console.log(res.data[0].created_at);
        return res.data
    } catch (error) {
        // if (axios.isAxiosError(error)) {
        //     console.log(error.data);
        // }
        console.log(error); 
    }
}


const start = async () => {
    console.log('start');

    const argv = yargs.options({
        fileName: {
            alias: 'o',
            type: 'string',
            demandOption: true,
            description: 'output file name'
        },
        ids: {
            alias: 'p',
            type: 'array',
            demandOption: true,
            description: 'list of project ids to export'
        }
      })
        .argv;
    
    const { fileName, ids } = argv

    const projects = await fetchProjects()

    let projectsToExport = []
    if (ids?.length) projectsToExport = projects.filter(project => ids.includes(project.id))
    projectsToExport = projectsToExport.map(item => ({ id: item.id, name: item.name, description: item.description }) )
    

    fs.writeFile(
        `${fileName}.json`,
        JSON.stringify(projectsToExport), 
        (err) => { 
            if (err) {
                console.log(err)
                throw err;
            } 
            console.log(`Projects were exported as ${fileName}.json`);
        }
    );
}

start()