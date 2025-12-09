import { Plus, Globe, Clock, MoreVertical } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for demo purposes
const mockProjects = [
  {
    id: "1",
    name: "E-commerce Store",
    thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
    updatedAt: "2 hours ago",
    status: "published",
  },
  {
    id: "2", 
    name: "Portfolio Site",
    thumbnail: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop",
    updatedAt: "Yesterday",
    status: "draft",
  },
  {
    id: "3",
    name: "SaaS Landing Page",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    updatedAt: "3 days ago",
    status: "published",
  },
];

export function ProjectsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {/* New Project Card */}
      <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer group">
        <CardContent className="flex flex-col items-center justify-center h-48 gap-3">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
          </div>
          <span className="text-muted-foreground group-hover:text-foreground font-medium">
            Create New Project
          </span>
        </CardContent>
      </Card>

      {/* Project Cards */}
      {mockProjects.map((project) => (
        <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
          <div className="relative h-36 overflow-hidden">
            <img
              src={project.thumbnail}
              alt={project.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 right-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {project.status === "published" && (
              <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-green-500/90 text-white text-xs px-2 py-1 rounded-full">
                <Globe className="w-3 h-3" />
                Live
              </div>
            )}
          </div>
          <CardFooter className="flex flex-col items-start gap-1 p-4">
            <h3 className="font-semibold">{project.name}</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {project.updatedAt}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
