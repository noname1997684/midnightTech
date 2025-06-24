"use client";

import { useUsers } from "@/lib/firestore/user/read";
import { Avatar, Button, CircularProgress } from "@heroui/react";

const ListView = () => {
  const { data: users, error, isLoading } = useUsers();
  if (isLoading)
    return (
      <div>
        <CircularProgress />
      </div>
    );
  if (error)
    return (
      <div className="bg-white p-5 rounded-xl flex-1 ">
        <h1>{error}</h1>
      </div>
    );
  return (
    <div className="md:pr-5 md:px-0 px-5 rounded-xl flex-1 flex flex-col gap-5">
      <table className="border-separate border-spacing-y-3">
        <thead>
          <tr>
            <th className="font-semibold border-y bg-white px-3 py-2 border-l rounded-l-lg">
              SN
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2">Photo</th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Name
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Email
            </th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user, index) => (
            <Row index={index} user={user} key={user.id} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

function Row({ user, index }) {
  return (
    <tr>
      <td className="border-y bg-white px-3 py-2 border-l rounded-l-lg text-center">
        {index + 1}
      </td>
      <td className="border-y bg-white px-3 py-2">
        <div className="flex items-center justify-center">
          <Avatar src={user.photoURL} />
        </div>
      </td>
      <td className="border-y bg-white px-3 py-2">{user.displayName}</td>
      <td className="border-y bg-white px-3 py-2">{user.email}</td>
    </tr>
  );
}

export default ListView;
