import request from "supertest"
import {app, HTTP_STATUSES} from "../../src";

let createdCourse:any = null

describe("/course", () => {
    beforeAll( async () => {
        await request(app).delete("/__test__/data")
    } )

    it("should return 200 and empty array", async () => {
       await request(app)
            .get("/courses")
            .expect(HTTP_STATUSES.OK_200,[])
    })

    it("should return 404 for not existing course", async () => {
        await request(app)
            .get("/courses/1")
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`shouldn't create course with incorrect input data`, async () => {
        await request(app)
            .post("/courses")
            .send({title: ""})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
    })

    it(`shouldn't create course with incorrect input data`, async () => {
        await request(app)
            .post("/courses")
            .send({title: ""})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get("/courses")
            .expect(200,[])
    })
let createdCourse1: any = null
    it(`should create course with correct input data`, async () => {
        const createResponse  = await request(app)
            .post("/courses")
            .send({title: "new data"})
            .expect(HTTP_STATUSES.CREATED_201)

        createdCourse1 = createResponse.body

        expect(createdCourse1).toEqual({
            id: expect.any(Number),
            title: "new data"
        })
        await request(app)
            .get("/courses")
            .expect(HTTP_STATUSES.OK_200,createdCourse1)
    })

    let createdCourse2:any = null
    it(`create one more course`, async () => {
        const createResponse  = await request(app)
            .post("/courses")
            .send({title: "new data"})
            .expect(HTTP_STATUSES.CREATED_201)

        createdCourse2 = createResponse.body

        expect(createdCourse2).toEqual({
            id: expect.any(Number),
            title: "new data 2"
        })
        await request(app)
            .get("/courses")
            .expect(200, createdCourse1,createdCourse2)
    })

    it(`shouldn't update course with incorrect input data`, async () => {
        await request(app)
            .put("/courses" + createdCourse.id)
            .send({title: ""})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get("/courses" + createdCourse.id)
            .expect(200,[createdCourse])
    })

    it(`shouldn't update course that not exist`, async () => {
        await request(app)
            .put("/courses" + -2)
            .send({title: "111"})
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`should update course with incorrect input model`, async () => {
        await request(app)
            .put("/courses" + createdCourse1.id)
            .send({title: "good new title"})
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get("/courses" + createdCourse1.id)
            .expect(200,{
                ...createdCourse1,
                title: "good new title"
            })
        await request(app)
            .get("/courses" + createdCourse2.id)
            .expect(200, createdCourse2)
    })

    it(`should delete all courses`, async () => {
        await request(app)
            .delete("/courses" + createdCourse1.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get("/courses" + createdCourse1.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .delete("/courses" + createdCourse2.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get("/courses" + createdCourse2.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .get("/courses")
            .expect(HTTP_STATUSES.NOT_FOUND_404, [])
    })
})