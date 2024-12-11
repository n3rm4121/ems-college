import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const users = [
    { id: 1, name: "Alice Johnson", role: "Student", department: "Computer Science" },
    { id: 2, name: "Bob Smith", role: "Teacher", department: "Physics" },
    { id: 3, name: "Charlie Brown", role: "Student", department: "Mathematics" },
    { id: 4, name: "Diana Ross", role: "Teacher", department: "Chemistry" },
]

export function UserManagement() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell className="font-medium">
                            <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-2">
                                    <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`} />
                                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                {user.name}
                            </div>
                        </TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>
                            <Button variant="outline" size="sm">Edit</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

