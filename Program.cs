using System;

namespace Namespace
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
        }

        public static string GetCurrentDate()
        {
            return DateTime.Now.ToString("yyyy-MM-dd");
        }

        // Get current date as YYYY/MM/DD
        public static string GetCurrentDateSlash()
        {
            return DateTime.Now.ToString("yyyy/MM/dd");
        }
    }
}
