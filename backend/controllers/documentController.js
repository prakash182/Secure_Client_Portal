const db = require("../config/db");

exports.uploadDoc = (req,res)=>{

 const userId = req.user.id; // JWT se
 const { title } = req.body;
 const filePath = req.file.path;

 // 1. Insert document
 db.query(`
  INSERT INTO documents (owner_id,title)
  VALUES (?,?)
 `,[userId,title],(err,result)=>{

  if(err) return res.status(500).json(err);

  const docId = result.insertId;

  // 2. Insert version
  db.query(`
   INSERT INTO document_versions
   (document_id,file_path,version_no)
   VALUES (?,?,1)
  `,[docId,filePath]);

  // 3. Insert approval
  db.query(`
   INSERT INTO approvals
   (document_id,user_id,level)
   VALUES (?,?,1)
  `,[docId,userId]);

  // 4. Audit log
  db.query(`
   INSERT INTO audit_logs
   (user_id,action,entity_type,entity_id,ip)
   VALUES (?,?,?,?,?)
  `,[userId,"Uploaded Document","document",docId,req.ip]);

  res.json({
    message:"Upload successful",
    docId
  });

 });

};

exports.addNewVersion = (req, res) => {

  const docId = req.params.id;
  const filePath = req.file.path;
  const userId = req.user.id;

  // Get current version
  db.query(
    "SELECT current_version FROM documents WHERE id=?",
    [docId],
    (err, result) => {

      if (err || result.length === 0)
        return res.status(404).json("Document not found");

      const newVersion = result[0].current_version + 1;

      // Insert version
      db.query(`
        INSERT INTO document_versions
        (document_id,file_path,version_no)
        VALUES (?,?,?)
      `,[docId,filePath,newVersion]);

      // Update document
      db.query(`
        UPDATE documents
        SET current_version=?
        WHERE id=?
      `,[newVersion,docId]);

      // Log
      db.query(`
        INSERT INTO audit_logs
        (user_id,action,entity_type,entity_id,ip)
        VALUES (?,?,?,?,?)
      `,[userId,"New Version Uploaded","document",docId,req.ip]);

      res.json({ message:"Version updated" });
    }
  );
};