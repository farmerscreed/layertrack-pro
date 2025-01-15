import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Upload } from "lucide-react"
import Papa from 'papaparse'
import { supabase } from "@/integrations/supabase/client"

export function ImportDataDialog() {
  const [open, setOpen] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importType, setImportType] = useState<string>("")
  const { toast } = useToast()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !importType) return

    setImporting(true)
    try {
      // Parse CSV file
      const result = await new Promise((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          complete: resolve,
          error: reject,
        })
      })

      // Send data to Edge Function
      const { data, error } = await supabase.functions.invoke('import-data', {
        body: { type: importType, data: result.data }
      })

      if (error) throw error

      toast({
        title: "Import Successful",
        description: "Your data has been imported successfully.",
      })
      setOpen(false)
    } catch (error) {
      console.error('Import error:', error)
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setImporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="mr-2 h-4 w-4" />
          Import Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Data</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import data into your farm management system.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Select
              value={importType}
              onValueChange={setImportType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select import type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="batches">Batches</SelectItem>
                <SelectItem value="feed_inventory">Feed Inventory</SelectItem>
                <SelectItem value="health_records">Health Records</SelectItem>
                <SelectItem value="egg_production">Egg Production</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={importing || !importType}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}