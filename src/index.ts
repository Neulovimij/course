import express, {Request, Response} from "express"
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "./types";
import {CourseCreateModel} from "./models/CreateCuorseModel";
import {UpdateCourseModel} from "./models/UpdateCourseModel";
import {QueryCoursesModel} from "./models/QueryCoursesModel";
import {CourseViewModel} from "./models/CourseViewModel";
import {UriParamsCourseIdModel} from "./models/UriParamsCourseIdModel";


export const app = express()
const port = 3000

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
}

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

type CourseType = {
    id: number,
    title: string,
    studentsCount: number
}

const db: {courses: CourseType[]} = {
    courses: [
        {id: 1, title: "front-end", studentsCount: 10},
        {id: 2, title: "back-end", studentsCount: 10},
        {id: 3, title: "automation qa", studentsCount: 10},
        {id: 4, title: "devops", studentsCount: 10},
    ]
}

const getCourseCourseViewModel = (dbCourse: CourseType): CourseViewModel => {
    return {
        id: dbCourse.id,
        title: dbCourse.title
    }
}

app.get('/courses', (req: RequestWithQuery<QueryCoursesModel>,
                     res: Response<CourseViewModel[]>) => {
    let foundCourses = db.courses;
    if (req.query.title) {
        // @ts-ignore
        foundCourses = foundCourses.find(c => c.title.indexOf(req.query.title) > -1);
    }
    if (!foundCourses.length) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    res.json(foundCourses.map(getCourseCourseViewModel))
})

app.get('/courses/:id', (req: RequestWithParams<UriParamsCourseIdModel>,
                         res: Response<CourseViewModel>) => {
    const foundCourse = db.courses.find(c => c.id === +req.params.id);

    if (!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    res.json(getCourseCourseViewModel(foundCourse))
})

app.post('/courses', (req: RequestWithBody<CourseCreateModel>,
                      res: Response<CourseViewModel>) => {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }
    const createdCourse: CourseType = {
        id: +(new Date()),
        title: req.body.title,
        studentsCount: 0

    }
    db.courses.push(createdCourse)
    res.status(HTTP_STATUSES.CREATED_201)
    res.json(getCourseCourseViewModel(createdCourse))
})

app.delete('/courses/:id', (req: RequestWithParams<UriParamsCourseIdModel>, res) => {

    db.courses = db.courses.filter(c => c.id !== +req.params.id);

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.put('/courses/:id', (req: RequestWithParamsAndBody<UriParamsCourseIdModel, UpdateCourseModel>, res) => {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }
    const foundCourses = db.courses.find(c => c.id === +req.params.id);
    if (!foundCourses) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.delete("/__test__/data", (req,res) => {
    db.courses = [];
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})