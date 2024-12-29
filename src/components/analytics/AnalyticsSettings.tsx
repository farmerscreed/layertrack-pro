import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";

const analyticsFormSchema = z.object({
  reportingPeriod: z.string().min(1, {
    message: "Please select a reporting period.",
  }),
  alertThreshold: z.string().min(1, {
    message: "Please set an alert threshold.",
  }),
});

export const AnalyticsSettings = () => {
  const form = useForm<z.infer<typeof analyticsFormSchema>>({
    resolver: zodResolver(analyticsFormSchema),
    defaultValues: {
      reportingPeriod: "monthly",
      alertThreshold: "10",
    },
  });

  function onSubmit(values: z.infer<typeof analyticsFormSchema>) {
    toast({
      title: "Analytics settings updated",
      description: "Your analytics preferences have been saved.",
    });
    console.log(values);
  }

  return (
    <Card className="col-span-2 bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Analytics Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reportingPeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reporting Period</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="monthly" 
                      {...field}
                      className="bg-white/5 border-white/20 focus:border-primary/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alertThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alert Threshold (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      className="bg-white/5 border-white/20 focus:border-primary/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
            >
              Update Settings
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};