const express = require("express");
const {NoteModel}=require("../model/note.model");
const noteRoute = express.Router();
const jwt = require("jsonwebtoken");

/**
 * @swagger
 * components:
 *  schemas:
 *     Notes:
 *        type: object
 *        properties:
 *             id:
 *                type: string
 *                description: The auto-generated id of the note
 *             title:
 *                 type: string
 *                 description: The note name
 *             subject:
 *                 type: string
 *                 description: The note subject
 */

noteRoute.get("/",async(req,res)=>{
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, "masai");
    try {
      if (decoded) {
        const notes = await NoteModel.find({ userID: decoded.userID });
        if (notes.length > 0) {
          res.status(200).send(notes);
        } else {
          res.status(400).send({ msg: "You haven't added any note yet!" });
        }
      }
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
   
})

/**
* @swagger
* /note/addnote:
*   post:
*     summary: To post the details of a note
*     tags: [Notes]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Notes'
*     responses:
*       200:
*         description: The note was successfully added
*     content:
*       application/json:
*         schema:
*            $ref: '#/components/schemas/Notes'
*       500:
*         description: Some server error
*/

noteRoute.post("/addnote",async(req,res)=>{
    try {
         const note = new NoteModel(req.body);
         await note.save();
         res.status(200).send({msg:"Notes added"}); 
    } catch (error) {
        res.status(400).send({ msg: "Failed to add note" });
    }
    })

    /**
* @swagger
* /note/updatenote/{id}:
*   patch:
*      summary: It will update the note details
*      tags: [Notes]
*      parameters:
*          - in: path
*            name: id
*            schema:
*              type: string
*            required: true
*            description: The note id
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/Notes'
*      responses:
*        200:
*          description: The note Deatils has been updated
*          content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/Notes'
*        404:
*          description: The not was not found
*        500:
*          description: Some error happened
*/

noteRoute.patch("/update/:id",async(req,res)=>{
    const {id} = req.params
    const payload = req.body
    try {
        await NoteModel.findByIdAndUpdate({_id:id},payload)
        res.status(200).send({"msg":"notes updated"})
    } catch (error) {
        res.status(400).send({"msg":"something went wrong"})
    }
})

/**
* @swagger
* /note/deletenote/{id}:
*   delete:
*       summary: Remove the note by id
*       tags: [Notes]
*       parameters:
*           - in: path
*             title: id
*             schema:
*                    type: string
*                    required: true
*                    description: The note id
*
*       responses:
*          200:
*              description: The note was deleted
*          404:
*              description: The note was not found
*/

noteRoute.delete("/delete/:id",async(req,res)=>{
    const {id}=req.params
    try {
        await NoteModel.findByIdAndDelete({_id:id})
        res.status(200).send({"msg":"notes Deleted"})
    } catch (error) {
        res.status(400).send({"msg":"something went wrong"})
    }
})

module.exports={
    noteRoute
}