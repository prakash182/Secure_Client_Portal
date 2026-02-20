import API from "../services/api";

export default function ApprovalButtons({ docId }) {

  const approve = async () => {
    await API.post(`/documents/${docId}/approve`);
  };

  const reject = async () => {
    await API.post(`/documents/${docId}/reject`);
  };

  return (
    <div>
      <button onClick={approve}>Approve</button>
      <button onClick={reject}>Request Changes</button>
    </div>
  );
}