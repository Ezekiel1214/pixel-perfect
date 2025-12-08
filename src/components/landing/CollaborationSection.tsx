import { Users, MousePointer2, Lock, MessageCircle } from "lucide-react";

export default function CollaborationSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Collaborate Like Never Before
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Built on Automerge CRDT technology with Supabase Realtime, enabling conflict-free 
              collaborative editing. See your team working together in real-time.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-secondary shrink-0">
                  <Users className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Live Presence</h3>
                  <p className="text-sm text-muted-foreground">
                    See who's online with color-coded avatars and activity indicators.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-secondary shrink-0">
                  <MousePointer2 className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Cursor Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Follow teammates' cursors as they navigate and edit the canvas.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-secondary shrink-0">
                  <Lock className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Component Locking</h3>
                  <p className="text-sm text-muted-foreground">
                    Prevent conflicts by locking components while editing.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-secondary shrink-0">
                  <MessageCircle className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Built-in Chat</h3>
                  <p className="text-sm text-muted-foreground">
                    Communicate with your team without leaving the builder.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Visual */}
          <div className="relative">
            <div className="bg-card border border-border p-6 shadow-lg">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-secondary" />
                  <span className="font-medium text-card-foreground">Live Preview</span>
                </div>
                <div className="flex -space-x-2">
                  {['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'].map((color, i) => (
                    <div 
                      key={i}
                      className="w-8 h-8 border-2 border-card flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: color, color: 'white' }}
                    >
                      {['A', 'B', 'C', 'D'][i]}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Mock Canvas */}
              <div className="relative aspect-video bg-background border border-border p-4">
                <div className="h-4 w-1/2 bg-secondary/30 mb-3" />
                <div className="h-3 w-3/4 bg-muted/30 mb-2" />
                <div className="h-3 w-2/3 bg-muted/30 mb-6" />
                <div className="flex gap-3">
                  <div className="h-8 w-24 bg-secondary" />
                  <div className="h-8 w-24 border border-border" />
                </div>
                
                {/* Cursor indicators */}
                <div className="absolute top-8 left-1/3">
                  <MousePointer2 className="w-4 h-4" style={{ color: '#6366f1' }} />
                  <div className="text-xs px-1 py-0.5 mt-1" style={{ backgroundColor: '#6366f1', color: 'white' }}>
                    Alice
                  </div>
                </div>
                
                <div className="absolute top-16 right-1/4">
                  <MousePointer2 className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                  <div className="text-xs px-1 py-0.5 mt-1" style={{ backgroundColor: '#8b5cf6', color: 'white' }}>
                    Bob
                  </div>
                </div>
              </div>
              
              {/* Chat Preview */}
              <div className="mt-4 p-3 bg-background border border-border">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6" style={{ backgroundColor: '#ec4899' }} />
                  <span className="text-muted-foreground">Carol:</span>
                  <span className="text-foreground">Just finished the hero section!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
