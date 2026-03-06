import { Label, Card, CardContent, Input } from '@/shared/ui';
import { useTreeRoot } from '@/store/tree-root';

export default function Config() {
  const { root, setTreeRoot } = useTreeRoot();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTreeRoot(e.target.value);
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 space-y-1">
              <Label htmlFor="tree-root" className="text-xs text-muted-foreground">
                root
              </Label>
              <Input value={root} id="tree-root" name="tree-root" className="h-8" onChange={onChange} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
