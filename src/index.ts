import {writeFile} from 'fs'
import axios from "axios";
// import yargs from 'yargs';
import * as yargs from 'yargs';


// AXIOS
const URL = 'https://api.app.shortcut.com/api/v3/projects'
const TOKEN = '6256ab94-efbb-4426-8d04-218bbc1156fc'

interface IProjectToExport {
    id: number,
    description: string,
    name: string,
}
interface IProject extends IProjectToExport {
    app_url: string,
    archived: boolean,
    entity_type: string,
    days_to_thermometer: number,
    color: string,
    workflow_id: number,
    start_time: string,
    updated_at: string,
    show_thermometer: boolean,
    follower_ids: any[],
    external_id: null | number,
    team_id: number,
    iteration_length: number,
    abbreviation: null | string,
    stats: { num_stories: number, num_points: number, num_related_documents: number },
    created_at: string
}

const fetchProjects = async (ids: number[]) => {
    const res = await axios.get<IProject[]>(
        URL, 
        { headers: { "Shortcut-Token": TOKEN }}
    )
    
    let projectsToExport: IProjectToExport[] | IProject[] = res.data
    if (ids?.length) projectsToExport = projectsToExport.filter(project => ids.includes(project.id))
    projectsToExport = projectsToExport.map(item => ({ id: item.id, name: item.name, description: item.description }) )

    return projectsToExport
}


const start = async () => {
    try {
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
            },
        }).parseSync();
        
        const { fileName, ids } = argv
    
        const projects = await fetchProjects(ids as number[])

    
        if (projects.length) {
            writeFile(
                `${fileName}.json`,
                JSON.stringify(projects), 
                (err) => { 
                    if (err) {
                        console.log(err)
                        throw err;
                    } 
                    console.log(`Projects were exported as ${fileName}.json`);
                }
            );
        } else {
            console.log('No project found. No file exported.'); 
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
            return [];
          } else {
            console.log('unexpected error: ', error);
            return []
          }
    }
}

start()